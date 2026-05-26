import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Factura por WhatsApp en segundos
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Simplifica tu facturación CFDI 4.0. Deja que tus clientes se facturen solos o genera facturas desde una conversación de WhatsApp.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Ir al Dashboard
              </Link>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Ver demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Facturación Rápida</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para tu negocio
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Integración con Facturapi
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Conectamos directamente con el PAC más moderno de México para garantizar validez ante el SAT.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  WhatsApp Cloud API
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Utilizamos la infraestructura oficial de Meta para asegurar que tus mensajes lleguen siempre y al menor costo.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Flujos Guiados
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Nuestro bot guía al usuario paso a paso, evitando errores en el RFC o montos.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
