import prisma from '../../lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let organization = null;
  let invoices: any[] = [];

  try {
    organization = await prisma.organization.findFirst();
    invoices = await prisma.invoice.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    });
  } catch (error) {
    console.error('Database connection failed at build time');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard FacturaMX</h1>
          <Link href="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
        </div>

        {!organization ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-700">
              No se ha configurado ninguna organización. Por favor, configura tus APIs en la base de datos para comenzar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Configuración de Facturapi</h2>
              <p className="text-sm text-gray-600">API Key: {organization.facturapiApiKey ? '••••••••' : 'No configurada'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Configuración de WhatsApp</h2>
              <p className="text-sm text-gray-600">Phone ID: {organization.whatsappPhoneId || 'No configurado'}</p>
              <p className="text-sm text-gray-600">Access Token: {organization.whatsappAccessToken ? '••••••••' : 'No configurado'}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Facturas Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">RFC</th>
                  <th className="px-6 py-3">Monto</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No hay facturas generadas todavía.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="text-sm">
                      <td className="px-6 py-4">{invoice.createdAt.toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium">{invoice.customer.legalName}</td>
                      <td className="px-6 py-4">{invoice.customer.taxId}</td>
                      <td className="px-6 py-4">${invoice.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          invoice.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {invoice.pdfUrl && (
                          <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PDF</a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
