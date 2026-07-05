import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio — FacturaMX",
};

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-800">
      <h1 className="mb-2 text-3xl font-bold">Términos de Servicio</h1>
      <p className="mb-8 text-sm text-gray-500">Última actualización: 4 de julio de 2026</p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">1. Aceptación</h2>
      <p>
        Al usar FacturaMX aceptas estos términos. Si no estás de acuerdo, no utilices el Servicio.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">2. El Servicio</h2>
      <p>
        FacturaMX facilita la emisión de comprobantes fiscales digitales (CFDI 4.0) a través de un
        PAC autorizado por el SAT (Facturapi) y de WhatsApp. FacturaMX no es un PAC ni un despacho
        contable, y no sustituye la asesoría de un contador.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">3. Tus responsabilidades</h2>
      <p>
        Eres responsable de la veracidad de los datos fiscales que proporciones (RFC, régimen,
        código postal, conceptos e importes). La validez fiscal de un CFDI depende de esos datos.
        Debes contar con autorización para facturar a nombre de la organización que registres.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">4. Disponibilidad y garantías</h2>
      <p>
        El Servicio se ofrece &ldquo;tal cual&rdquo;. Dependemos de servicios de terceros (SAT,
        PAC, WhatsApp) y no garantizamos disponibilidad ininterrumpida. En la máxima medida
        permitida por la ley, no somos responsables de daños indirectos derivados del uso del
        Servicio, incluyendo rechazos o cancelaciones de CFDI atribuibles a datos incorrectos o a
        fallas de terceros.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">5. Datos personales</h2>
      <p>
        El tratamiento de datos personales se rige por nuestro{" "}
        <a className="underline" href="/privacidad">Aviso de Privacidad</a>.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">6. Cambios y contacto</h2>
      <p>
        Podemos actualizar estos términos; el uso continuado implica aceptación. Preguntas:{" "}
        <a className="underline" href="mailto:oscargml@gmail.com">oscargml@gmail.com</a>.
      </p>
    </main>
  );
}
