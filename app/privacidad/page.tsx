import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad — FacturaMX",
};

export default function AvisoPrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-800">
      <h1 className="mb-2 text-3xl font-bold">Aviso de Privacidad</h1>
      <p className="mb-8 text-sm text-gray-500">Última actualización: 4 de julio de 2026</p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Responsable</h2>
      <p>
        FacturaMX (el &ldquo;Servicio&rdquo;) es responsable del tratamiento de tus datos
        personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
        Particulares (LFPDPPP). Contacto:{" "}
        <a className="underline" href="mailto:oscargml@gmail.com">oscargml@gmail.com</a>.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Datos que recabamos</h2>
      <p>
        Para emitir comprobantes fiscales (CFDI 4.0) recabamos: RFC, nombre o razón social,
        régimen fiscal, código postal, correo electrónico y número de WhatsApp, así como los datos
        de las operaciones a facturar (conceptos e importes). No recabamos datos personales
        sensibles.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Finalidades</h2>
      <p>
        Usamos tus datos para: (1) timbrar y emitir facturas CFDI válidas ante el SAT; (2)
        comunicarnos contigo por WhatsApp durante el proceso de facturación; (3) entregarte los
        archivos PDF y XML de tus facturas; y (4) mantener el registro de facturas emitidas que
        exige la normativa fiscal. No usamos tus datos con fines publicitarios.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Transferencias y encargados</h2>
      <p>
        Para operar el Servicio compartimos datos con encargados de tratamiento: Facturapi (PAC
        autorizado por el SAT, para el timbrado de CFDI), Meta Platforms (WhatsApp Cloud API, para
        la mensajería) y nuestro proveedor de infraestructura en la nube (Vercel y base de datos
        asociada). Estos proveedores tratan los datos únicamente por cuenta del Servicio. Fuera de
        estos casos y de las obligaciones legales ante autoridades fiscales, no transferimos tus
        datos a terceros.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Derechos ARCO</h2>
      <p>
        Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición, así como
        revocar tu consentimiento o limitar el uso de tus datos, escribiendo a{" "}
        <a className="underline" href="mailto:oscargml@gmail.com">oscargml@gmail.com</a> con el
        asunto &ldquo;Derechos ARCO&rdquo;. Responderemos en los plazos que marca la LFPDPPP. Ten
        en cuenta que los CFDI ya emitidos deben conservarse conforme a las obligaciones fiscales
        vigentes. También puedes acudir al INAI (www.inai.org.mx) si consideras que tu derecho a la
        protección de datos ha sido vulnerado.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Conservación y seguridad</h2>
      <p>
        Conservamos los datos mientras tu cuenta esté activa y durante los plazos de conservación
        fiscal aplicables. Aplicamos medidas de seguridad administrativas y técnicas razonables
        (cifrado en tránsito, control de acceso) para proteger tu información.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Cambios a este aviso</h2>
      <p>
        Cualquier cambio a este aviso se publicará en esta página; la fecha superior indica la
        última revisión.
      </p>
    </main>
  );
}
