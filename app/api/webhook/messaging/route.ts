import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import prisma from '../../../../lib/prisma';
import { WhatsAppService } from '../../../../lib/messaging-service';
import { FacturapiService } from '../../../../lib/pac-service';

// Verifies Meta's X-Hub-Signature-256 header against the raw request body.
// Meta computes HMAC-SHA256 over the exact raw payload using the app secret and
// sends it as `sha256=<hex>`. We must compare against the untouched bytes, so the
// caller passes the raw body string (re-serializing JSON would change the bytes).
function isValidSignature(rawBody: string, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false;
  }

  const expected = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');
  const received = signatureHeader.slice('sha256='.length);

  const expectedBuf = Buffer.from(expected, 'hex');
  const receivedBuf = Buffer.from(received, 'hex');

  // timingSafeEqual throws on length mismatch, so guard first.
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return timingSafeEqual(expectedBuf, receivedBuf);
}

export async function GET(request: NextRequest) {
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (!verifyToken) {
    console.error('WHATSAPP_WEBHOOK_VERIFY_TOKEN is not set');
    return new Response('Server misconfiguration', { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === verifyToken) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.error('WHATSAPP_APP_SECRET is not set');
    return new Response('Server misconfiguration', { status: 500 });
  }

  // Read the raw body first: HMAC must be computed over the exact bytes Meta signed.
  const rawBody = await request.text();

  if (!isValidSignature(rawBody, request.headers.get('x-hub-signature-256'), appSecret)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const body = JSON.parse(rawBody);

  if (body.object !== 'whatsapp_business_account') {
    return NextResponse.json({ error: 'Not a WhatsApp webhook' }, { status: 404 });
  }

  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];

  if (!message) {
    return NextResponse.json({ status: 'ok' });
  }

  const phoneNumber = message.from;
  const messageText = message.text?.body || message.interactive?.button_reply?.title || message.interactive?.list_reply?.title;

  try {
    let session = await prisma.whatsAppSession.findUnique({
      where: { phoneNumber },
    });

    if (!session) {
      session = await prisma.whatsAppSession.create({
        data: { phoneNumber, state: 'IDLE' },
      });
    }

    const organization = await prisma.organization.findFirst();
    if (!organization || !organization.facturapiApiKey || !organization.whatsappPhoneId || !organization.whatsappAccessToken) {
        console.error('Organization not configured');
        return NextResponse.json({ status: 'ok' });
    }

    const whatsapp = new WhatsAppService(organization.whatsappPhoneId, organization.whatsappAccessToken);
    const facturapi = new FacturapiService(organization.facturapiApiKey);

    switch (session.state) {
      case 'IDLE':
        await whatsapp.sendTextMessage(phoneNumber, '¡Hola! Bienvenido a FacturaMX. ¿Deseas generar una factura? Por favor, escribe el RFC del cliente.');
        await prisma.whatsAppSession.update({
          where: { phoneNumber },
          data: { state: 'ASK_RFC' },
        });
        break;

      case 'ASK_RFC':
        const rfc = messageText.toUpperCase().trim();
        if (!rfc.match(/^[A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3}$/)) {
          await whatsapp.sendTextMessage(phoneNumber, 'El RFC ingresado no parece válido. Por favor, intenta de nuevo.');
          return NextResponse.json({ status: 'ok' });
        }

        const customer = await facturapi.getCustomerByTaxId(rfc);
        if (customer) {
          await whatsapp.sendInteractiveButtons(phoneNumber, `Encontré al cliente: ${customer.legal_name}. ¿Es correcto?`, [
            { id: 'confirm_customer_yes', title: 'Sí, es correcto' },
            { id: 'confirm_customer_no', title: 'No, otro RFC' },
          ]);
          await prisma.whatsAppSession.update({
            where: { phoneNumber },
            data: {
              state: 'CONFIRM_CUSTOMER',
              data: { rfc, facturapiCustomerId: customer.id, legalName: customer.legal_name }
            },
          });
        } else {
          await whatsapp.sendTextMessage(phoneNumber, 'No encontré a ese cliente en Facturapi. Por ahora, solo puedo facturar a clientes ya registrados en tu panel.');
          await prisma.whatsAppSession.update({
            where: { phoneNumber },
            data: { state: 'IDLE' },
          });
        }
        break;

      case 'CONFIRM_CUSTOMER':
        if (messageText.toLowerCase().includes('sí')) {
          await whatsapp.sendTextMessage(phoneNumber, 'Excelente. Ahora, ¿cuál es el monto total de la factura? (Solo el número)');
          await prisma.whatsAppSession.update({
            where: { phoneNumber },
            data: { state: 'ASK_AMOUNT' },
          });
        } else {
          await whatsapp.sendTextMessage(phoneNumber, 'Entendido. Por favor, escribe el RFC correcto.');
          await prisma.whatsAppSession.update({
            where: { phoneNumber },
            data: { state: 'ASK_RFC', data: {} },
          });
        }
        break;

      case 'ASK_AMOUNT':
        const amount = parseFloat(messageText.replace(/[^0-9.]/g, ''));
        if (isNaN(amount) || amount <= 0) {
          await whatsapp.sendTextMessage(phoneNumber, 'Por favor, ingresa un monto válido mayor a cero.');
          return NextResponse.json({ status: 'ok' });
        }

        const sessionData: any = session.data;
        await whatsapp.sendInteractiveButtons(
          phoneNumber,
          `Resumen:\nCliente: ${sessionData.legalName}\nMonto: $${amount}\n¿Deseas generar la factura ahora?`,
          [
            { id: 'gen_yes', title: 'Sí, generar' },
            { id: 'gen_no', title: 'Cancelar' },
          ]
        );

        await prisma.whatsAppSession.update({
          where: { phoneNumber },
          data: {
            state: 'CONFIRM_GENERATION',
            data: { ...sessionData, amount }
          },
        });
        break;

      case 'CONFIRM_GENERATION':
        if (messageText.toLowerCase().includes('sí') || messageText.toLowerCase().includes('generar')) {
          const finalData: any = session.data;
          await whatsapp.sendTextMessage(phoneNumber, 'Generando factura... un momento por favor.');

          try {
            const invoiceResponse = await facturapi.createInvoice({
              customer_id: finalData.facturapiCustomerId,
              items: [{
                quantity: 1,
                product: {
                  description: 'Venta de productos/servicios',
                  product_key: '01010101', // Genérico SAT
                  price: finalData.amount,
                  tax_included: true
                }
              }],
              payment_form: '01', // Efectivo por defecto
            });

            // Persist customer if not already in local DB
            let localCustomer = await prisma.customer.findFirst({
              where: { taxId: finalData.rfc, organizationId: organization.id }
            });

            if (!localCustomer) {
              localCustomer = await prisma.customer.create({
                data: {
                  taxId: finalData.rfc,
                  legalName: finalData.legalName,
                  externalId: finalData.facturapiCustomerId,
                  organizationId: organization.id,
                  whatsappNumber: phoneNumber
                }
              });
            }

            // Save Invoice to local DB
            await prisma.invoice.create({
              data: {
                externalId: invoiceResponse.id,
                amount: finalData.amount,
                status: 'issued',
                pdfUrl: invoiceResponse.files.pdf,
                xmlUrl: invoiceResponse.files.xml,
                organizationId: organization.id,
                customerId: localCustomer.id
              }
            });

            await whatsapp.sendTextMessage(phoneNumber, `¡Factura generada con éxito!\nFolio: ${invoiceResponse.uuid}\n\nPuedes descargarla aquí:\nPDF: ${invoiceResponse.files.pdf}\nXML: ${invoiceResponse.files.xml}`);

            await prisma.whatsAppSession.update({
              where: { phoneNumber },
              data: { state: 'IDLE', data: {} },
            });

          } catch (error: any) {
            console.error('Error creating invoice:', error.response?.data || error.message);
            await whatsapp.sendTextMessage(phoneNumber, 'Hubo un error al generar la factura. Por favor, intenta más tarde.');
          }
        } else {
          await whatsapp.sendTextMessage(phoneNumber, 'Proceso cancelado. Escribe algo para comenzar de nuevo.');
          await prisma.whatsAppSession.update({
            where: { phoneNumber },
            data: { state: 'IDLE', data: {} },
          });
        }
        break;

      default:
        await prisma.whatsAppSession.update({
          where: { phoneNumber },
          data: { state: 'IDLE' },
        });
        break;
    }

  } catch (error) {
    console.error('Webhook error:', error);
  }

  return NextResponse.json({ status: 'ok' });
}
