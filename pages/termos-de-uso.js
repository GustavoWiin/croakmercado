import Head from "next/head";

export default function TermosDeUso() {
  const atualizadoEm = "27 de agosto de 2025";

  return (
    <>
      <Head>
        <title>Termos de Uso — Benefic Verific</title>
        <meta
          name="description"
          content="Termos de Uso da Benefic Verific: regras de utilização do conteúdo informativo sobre consultas em bases públicas."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
        {/* Header (sem imagens, paleta rosa) */}
        <header className="w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <a href="/inicio" className="flex items-center gap-3" aria-label="Voltar ao início">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/10 text-rose-700 font-black">BV</span>
              <span className="font-semibold text-gray-900">Benefic Verific</span>
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm">
              <a href="/servicos" className="text-gray-600 hover:text-gray-900">Serviços</a>
              <a href="/politica-de-privacidade" className="text-gray-600 hover:text-gray-900">Privacidade</a>
            </nav>
          </div>
        </header>

        {/* Hero (rosa) */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_30%_at_50%_0%,rgba(244,63,94,0.12),transparent_70%)]" />
          <div className="mx-auto max-w-3xl px-6 pt-16 pb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Termos de Uso
            </h1>
            <p className="mt-3 text-gray-600">Última atualização: {atualizadoEm}</p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-8">
            {/* 0. Escopo e aceitação */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">1. Escopo e Aceitação</h2>
              <p className="mt-2 text-gray-700">
                Estes Termos regulam o uso do site e do conteúdo informativo disponibilizado pela Benefic Verific,
                voltado a orientar o titular sobre consultas em <em>bases públicas e oficiais</em>. Ao acessar ou
                utilizar o site, você concorda com estes Termos. Caso não concorde, não utilize nossos conteúdos.
              </p>
            </div>

            {/* 2. Natureza do conteúdo */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">2. Natureza do Conteúdo</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                <li>O conteúdo é informativo e educativo; não prestamos assessoria jurídica, contábil ou financeira.</li>
                <li>Não prometemos “limpeza de nome”, não intermediamo­s acordos e não recebemos pagamentos.</li>
                <li>Indicamos <strong>canais oficiais do Governo</strong> como meios adequados para registrar e acompanhar solicitações.</li>
              </ul>
            </div>

            {/* 3. Elegibilidade e uso correto */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">3. Elegibilidade e Uso Correto</h2>
              <p className="mt-2 text-gray-700">
                Você declara ser o titular dos dados eventualmente informados para fins de demonstração e
                concorda em utilizá-los apenas para fins lícitos e pessoais. É vedado utilizar dados de terceiros
                sem autorização, realizar tentativas de acesso indevido a sistemas ou automatizar coletas de forma abusiva.
              </p>
            </div>

            {/* 4. Limitações e disponibilidade */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">4. Limitações e Disponibilidade</h2>
              <p className="mt-2 text-gray-700">
                Informações públicas podem variar conforme atualização das fontes, homônimos e restrições de acesso.
                Não garantimos disponibilidade contínua do site, podendo haver interrupções por manutenção, força
                maior ou adequações técnicas.
              </p>
            </div>

            {/* 5. Responsabilidades do usuário */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">5. Responsabilidades do Usuário</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                <li>Verificar a exatidão de dados antes de qualquer conclusão ou decisão.</li>
                <li>Guardar comprovantes/protocolos obtidos nos <strong>canais oficiais</strong>.</li>
                <li>Respeitar direitos de terceiros, privacidade e a legislação aplicável (incluindo LGPD).</li>
              </ul>
            </div>

            {/* 6. Proibições */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">6. Proibições</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                <li>Usar o site para fins fraudulentos, ilícitos ou para “limpeza” de dados de terceiros.</li>
                <li>Coletar dados em massa, “scraping” abusivo ou engenharia reversa de componentes.</li>
                <li>Publicar conteúdo difamatório, discriminatório, que infrinja direitos autorais ou de personalidade.</li>
              </ul>
            </div>

            {/* 7. Propriedade intelectual */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">7. Propriedade Intelectual</h2>
              <p className="mt-2 text-gray-700">
                Textos, layout, marcas nominativas e elementos do site pertencem à Benefic Verific ou a terceiros
                licenciadores, sendo vedada a reprodução não autorizada. É permitido o uso pessoal e não comercial,
                com citação da fonte, quando aplicável.
              </p>
            </div>

            {/* 8. Privacidade e proteção de dados (remissão) */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">8. Privacidade e Proteção de Dados</h2>
              <p className="mt-2 text-gray-700">
                O tratamento de dados pessoais segue a nossa <a href="/politica-de-privacidade" className="text-rose-600 hover:underline">Política de Privacidade</a>,
                que integra estes Termos. Utilizamos apenas cookies essenciais ao funcionamento e segurança.
              </p>
            </div>

            {/* 9. Comunicações e canais oficiais do governo */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">9. Comunicações e Canais Oficiais do Governo</h2>
              <div className="mt-2 rounded-xl bg-rose-50 p-4 text-rose-900">
                <p className="text-sm">
                  <strong>Importante:</strong> Não realizamos atendimento por e-mail para solicitações de direitos
                  de titulares ou reclamações. Para registrar, acompanhar e resolver demandas, utilize os <strong>canais
                  oficiais do Governo</strong> (por exemplo, plataformas integradas ao gov.br, Procons, defensorias
                  públicas e órgãos competentes). Esses são os meios formais de protocolo e resolução.
                </p>
              </div>
            </div>

            {/* 10. Isenções e limitações de responsabilidade */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">10. Isenções e Limitações de Responsabilidade</h2>
              <p className="mt-2 text-gray-700">
                O conteúdo é fornecido “no estado em que se encontra” para fins informativos. Não nos responsabilizamos
                por decisões tomadas com base nas informações do site, tampouco por indisponibilidades, falhas de terceiros
                ou incongruências de bases públicas. Busque orientação profissional quando necessário.
              </p>
            </div>

            {/* 11. Alterações nos termos */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">11. Alterações destes Termos</h2>
              <p className="mt-2 text-gray-700">
                Podemos atualizar estes Termos para refletir mudanças legais, técnicas ou operacionais. Publicaremos a
                nova versão com data de atualização no topo desta página. O uso contínuo do site após as alterações
                representa aceitação dos novos termos.
              </p>
            </div>

            {/* 12. Disposições gerais */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">12. Disposições Gerais</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                <li><strong>Independência das cláusulas:</strong> nulidade de uma não invalida as demais.</li>
                <li><strong>Força maior:</strong> eventos fora do nosso controle podem afetar a disponibilidade do site.</li>
                <li><strong>Legislação aplicável:</strong> Lei brasileira. Conflitos serão preferencialmente resolvidos
                  por meios administrativos nos <strong>canais oficiais do Governo</strong> antes de medidas judiciais.</li>
              </ul>
            </div>

            {/* Aviso final acessível (rosa) */}
            <div className="rounded-xl bg-rose-50 p-4 text-rose-900">
              <p className="text-sm">
                Este site não solicita pagamentos, não envia boletos e não promete resultados. Use sempre canais oficiais
                do Governo para registrar e acompanhar solicitações formais.
              </p>
            </div>
          </div>
        </section>

        {/* Footer (sem e-mail) */}
        <footer className="bg-white border-t border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600 flex flex-wrap items-center justify-between gap-4">
            <p>© 2025 Benefic Verific. Todos os direitos reservados.</p>
            <p className="text-gray-600">Demandas devem ser registradas e acompanhadas pelos canais oficiais do Governo.</p>
          </div>
        </footer>
      </main>

      {/* Estilos globais (rosa) */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        :root {
          --radius-xl: 1.25rem;
          --elev-1: 0 8px 24px rgba(16, 24, 40, 0.08);
          --elev-2: 0 12px 32px rgba(16, 24, 40, 0.12);
          --ring: 0 0 0 3px rgba(244, 63, 94, 0.18);
        }

        /* Glow rosa no hero */
        section.relative:first-of-type::before {
          content: "";
          position: absolute; inset: -20% -10% auto -10%;
          height: 60%;
          background: radial-gradient(40% 50% at 50% 50%, rgba(244,63,94,.18), transparent 70%);
          filter: blur(20px);
          animation: glow 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        @keyframes glow {
          0%   { transform: translateY(0) scale(1);   opacity: .9; }
          100% { transform: translateY(10px) scale(1.08); opacity: 1; }
        }

        /* Cartões */
        .rounded-2xl.bg-white.shadow-sm {
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          border-radius: var(--radius-xl);
          box-shadow: var(--elev-1);
        }
        .rounded-2xl.bg-white.shadow-sm:hover {
          transform: translateY(-3px);
          box-shadow: var(--elev-2);
          border-color: rgba(244,63,94,.25) !important;
        }

        /* Links */
        a { transition: color .2s ease, opacity .2s ease; }
        a:hover { opacity: .92; }

        /* Acessibilidade: reduzir movimento */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}
