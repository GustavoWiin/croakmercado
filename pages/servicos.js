import Head from "next/head";

export default function Servicos() {
  return (
    <>
      <Head>
        <title>Serviços — Benefic Verific</title>
        <meta
          name="description"
          content="Conheça os serviços da Benefic Verific: consulta em bases públicas no SEU nome, validação de homônimos e relatório com evidências."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
        {/* Header */}
        <header className="w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <a href="/inicio" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <span className="font-semibold text-gray-900">Benefic Verific</span>
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm">
              <a href="/politica-de-privacidade" className="text-gray-600 hover:text-gray-900">Privacidade</a>
              <a href="/termos-de-uso" className="text-gray-600 hover:text-gray-900">Termos</a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_30%_at_50%_0%,rgba(59,130,246,0.12),transparent_70%)]" />
          <div className="mx-auto max-w-4xl px-6 pt-16 pb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Nossos Serviços</h1>
            <p className="mt-3 text-gray-600">
              Consulta em bases públicas e oficiais, exclusivamente no <strong>SEU</strong> nome — com
              validação de homônimos e relatório claro, com links de evidência.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Serviço 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                <h2 className="text-lg font-semibold text-gray-900">Consulta Básica</h2>
              </div>
              <p className="mt-3 text-gray-700">
                Busca em bases públicas essenciais para identificar menções ao seu nome. Entrega rápida
                com resumo objetivo.
              </p>
              <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-1 text-sm">
                <li>Verificação de menções ao nome</li>
                <li>Resumo dos achados</li>
                <li>Links das fontes</li>
              </ul>
              <a href="https://pagamento.meunometemcoisa.online/checkout?product=74afd082-8366-11f0-986a-46da4690ad53" className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Solicitar
              </a>
            </div>

            {/* Serviço 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                <h2 className="text-lg font-semibold text-gray-900">Consulta Completa</h2>
              </div>
              <p className="mt-3 text-gray-700">
                Abrange mais fontes e valida homônimos. Ideal para quem deseja checagem minuciosa e
                relatório detalhado.
              </p>
              <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-1 text-sm">
                <li>Validação de homônimos</li>
                <li>Detalhamento por base consultada</li>
                <li>PDF com evidências e datas</li>
              </ul>
              <a href="https://pagamento.meunometemcoisa.online/checkout?product=74afd082-8366-11f0-986a-46da4690ad53" className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Solicitar
              </a>
            </div>

            {/* Serviço 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                <h2 className="text-lg font-semibold text-gray-900">Acompanhamento Mensal</h2>
              </div>
              <p className="mt-3 text-gray-700">
                Monitoramento periódico para avisar se surgir algo novo ligado ao seu nome nas bases
                públicas.
              </p>
              <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-1 text-sm">
                <li>Alertas por e-mail</li>
                <li>Resumo mensal</li>
                <li>Cancelamento a qualquer momento</li>
              </ul>
              <a href="https://pagamento.meunometemcoisa.online/checkout?product=74afd082-8366-11f0-986a-46da4690ad53" className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Solicitar
              </a>
            </div>
          </div>

          {/* Contato */}
          <div className="mt-12 text-center">
            <p className="text-gray-700">
              Precisa de algo específico? Escreva para{" "}
              <a className="text-blue-600 hover:underline" href="mailto:contato@meunometemcoisa.online">
                contato@meunometemcoisa.online
              </a>.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600 flex flex-wrap items-center justify-between gap-4">
            <p>© 2025 Benefic Verific. Todos os direitos reservados.</p>
            <a href="mailto:contato@meunometemcoisa.online" className="hover:text-gray-900">
              contato@meunometemcoisa.online
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
