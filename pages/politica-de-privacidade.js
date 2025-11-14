import Head from "next/head";

export default function PoliticaDePrivacidade() {
  const atualizadoEm = "27 de agosto de 2025";

  return (
    <>
      <Head>
        <title>Política de Privacidade — Benefic Verific</title>
        <meta
          name="description"
          content="Política de Privacidade da Benefic Verific: como coletamos, usamos e protegemos seus dados pessoais."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
        {/* Header (sem imagens, rosa) */}
        <header className="w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <a href="/inicio" className="flex items-center gap-3" aria-label="Voltar ao início">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/10 text-rose-700 font-black">BV</span>
              <span className="font-semibold text-gray-900">Benefic Verific</span>
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm">
              <a href="/servicos" className="text-gray-600 hover:text-gray-900">Serviços</a>
              <a href="/termos-de-uso" className="text-gray-600 hover:text-gray-900">Termos</a>
            </nav>
          </div>
        </header>

        {/* Hero (rosa) */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_30%_at_50%_0%,rgba(244,63,94,0.12),transparent_70%)]" />
          <div className="mx-auto max-w-3xl px-6 pt-16 pb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Política de Privacidade
            </h1>
            <p className="mt-3 text-gray-600">Última atualização: {atualizadoEm}</p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-8">
            {/* 0. Escopo */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">0. Escopo desta Política</h2>
              <p className="mt-2 text-gray-700">
                Esta Política descreve como a Benefic Verific trata dados pessoais no contexto de
                informações fornecidas voluntariamente pelo titular para consultas em bases públicas.
                Não realizamos “limpeza de nome”, não prometemos resultados e não intermediamos acordos
                financeiros. Nosso foco é orientar o titular sobre como verificar e acompanhar seus dados
                nos canais oficiais.
              </p>
            </div>

            {/* 1. Informações que coletamos */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">1. Informações que coletamos</h2>
              <p className="mt-2 text-gray-700">
                Coletamos apenas os dados estritamente necessários para realizar a consulta em seu nome,
                como <strong>nome completo</strong> e, opcionalmente, <strong>CPF/CNPJ</strong> para diferenciar
                homônimos. Não coletamos categorias sensíveis além do indispensável para a finalidade proposta.
              </p>
              <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
                <li>Dados de identificação (nome, CPF/CNPJ — opcional);</li>
                <li>Dados técnicos mínimos (logs de acesso, endereço IP, data/hora) para segurança e auditoria;</li>
                <li>Preferências de navegação estritamente necessárias (cookies essenciais — ver Seção 8).</li>
              </ul>
            </div>

            {/* 2. Finalidades do uso */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">2. Como usamos seus dados</h2>
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                <li>Executar consultas em bases <em>públicas e oficiais</em> quando aplicável;</li>
                <li>Organizar e apresentar informações ao próprio titular;</li>
                <li>Prevenir fraudes, manter registros de segurança e cumprir obrigações legais.</li>
              </ul>
            </div>

            {/* 3. Bases legais (LGPD) */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">3. Bases legais (LGPD)</h2>
              <p className="mt-2 text-gray-700">
                Tratamos dados com fundamento em: (i) <strong>execução de procedimentos preliminares</strong>
                a pedido do titular; (ii) <strong>cumprimento de obrigação legal/regulatória</strong>; e (iii)
                <strong> legítimo interesse</strong>, quando aplicável e sempre preservando direitos e liberdades
                fundamentais do titular.
              </p>
            </div>

            {/* 4. Compartilhamento */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">4. Compartilhamento</h2>
              <p className="mt-2 text-gray-700">
                Não vendemos dados pessoais. Compartilhamos informações somente quando estritamente necessário,
                por exemplo, com provedores de infraestrutura (hospedagem, segurança) e exclusivamente sob
                acordos de confidencialidade e proteção de dados.
              </p>
            </div>

            {/* 5. Segurança e retenção */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">5. Segurança e retenção</h2>
              <p className="mt-2 text-gray-700">
                Empregamos medidas técnicas e administrativas para proteger seus dados contra acessos não
                autorizados, perda ou alteração. Mantemos registros apenas pelo tempo necessário para
                comprovação de execução e obrigações legais. Dados não essenciais são minimizados ou
                anonimizados sempre que possível.
              </p>
            </div>

            {/* 6. Seus direitos */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">6. Seus direitos</h2>
              <p className="mt-2 text-gray-700">
                Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade
                e eliminação de dados pessoais, nos termos da LGPD. Para registrar e acompanhar demandas oficiais,
                orientamos utilizar os <strong>canais do Governo</strong> (por exemplo, plataformas integradas ao
                <strong> gov.br</strong> e órgãos competentes). Não realizamos atendimento por e-mail; a resolução
                de solicitações deve ocorrer pelos meios oficiais do governo.
              </p>
            </div>

            {/* 7. Transferências internacionais */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">7. Transferência internacional de dados</h2>
              <p className="mt-2 text-gray-700">
                Caso serviços de infraestrutura utilizem servidores fora do Brasil, aplicamos salvaguardas adequadas
                (cláusulas contratuais, padrões de segurança e privacidade) para garantir nível de proteção compatível
                com a legislação brasileira.
              </p>
            </div>

            {/* 8. Cookies e tecnologias similares */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">8. Cookies e tecnologias similares</h2>
              <p className="mt-2 text-gray-700">
                Utilizamos apenas <strong>cookies essenciais</strong> para funcionamento e segurança do site.
                Não empregamos cookies de publicidade ou perfis comportamentais. Você pode gerenciar cookies
                no navegador; desativá-los pode afetar recursos básicos.
              </p>
            </div>

            {/* 9. Registros de log e segurança */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">9. Registros de log e integridade</h2>
              <p className="mt-2 text-gray-700">
                Mantemos logs mínimos (IP, datas/horas, user-agent) para proteção contra abuso, detecção de
                fraudes e auditoria de incidentes. Esses registros são acessados apenas por pessoal autorizado.
              </p>
            </div>

            {/* 10. Crianças e adolescentes */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">10. Crianças e adolescentes</h2>
              <p className="mt-2 text-gray-700">
                Nosso conteúdo é informativo e não se destina especificamente a crianças. Caso seja necessário
                tratar dados de menores, observaremos o <strong>melhor interesse</strong> do menor e exigiremos
                autorização adequada, conforme a legislação.
              </p>
            </div>

            {/* 11. Relacionamento e resolução de demandas */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">11. Atendimento e resolução de demandas</h2>
              <div className="mt-2 rounded-xl bg-rose-50 p-4 text-rose-900">
                <p className="text-sm">
                  <strong>Importante:</strong> Não oferecemos suporte por e-mail. Para exercer direitos de
                  titular, registrar reclamações, denúncias ou solicitar providências, utilize os <strong>canais
                  oficiais do Governo</strong> (por exemplo, plataformas integradas ao gov.br, Procons,
                  defensorias e órgãos competentes). Esses canais são os meios formais de registro,
                  acompanhamento e resolução.
                </p>
              </div>
            </div>

            {/* 12. Alterações desta Política */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">12. Alterações desta Política</h2>
              <p className="mt-2 text-gray-700">
                Podemos atualizar esta Política para refletir mudanças legais, técnicas ou operacionais.
                Quando isso ocorrer, indicaremos a data de atualização no topo desta página. Recomendamos
                revisar este documento periodicamente.
              </p>
            </div>
          </div>
        </section>

        {/* Footer (sem e-mail) */}
        <footer className="bg-white border-t border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-600 flex flex-wrap items-center justify-between gap-4">
            <p>© 2025 Benefic Verific. Todos os direitos reservados.</p>
            <p className="text-gray-600">
              Demandas devem ser registradas e acompanhadas pelos canais oficiais do Governo.
            </p>
          </div>
        </footer>
      </main>

      {/* Estilos globais e acessibilidade (rosa) */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        :root {
          --radius-xl: 1.25rem;
          --elev-1: 0 8px 24px rgba(16, 24, 40, 0.08);
          --elev-2: 0 12px 32px rgba(16, 24, 40, 0.12);
          --ring: 0 0 0 3px rgba(244, 63, 94, 0.18);
        }

        /* Hero glow rosa suave */
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

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}
