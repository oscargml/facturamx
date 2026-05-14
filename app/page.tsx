export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900">
          FacturaMX
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Sistema de facturación CFDI 4.0 para México
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Clientes
            </h2>

            <p className="text-gray-500 mt-2">
              Administración de clientes SAT
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Productos
            </h2>

            <p className="text-gray-500 mt-2">
              Catálogo SAT de productos y servicios
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Facturas
            </h2>

            <p className="text-gray-500 mt-2">
              Generación CFDI 4.0
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}