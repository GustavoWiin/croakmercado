import { useState } from "react";

export default function Quiz() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [cookiesOpen, setCookiesOpen] = useState(true);

  // ===== [ADICIONADO] Helper para anexar os parâmetros atuais (UTM e afins) ao destino =====
  const withQuery = (url) => {
    try {
      const srcQs = typeof window !== "undefined" ? window.location.search : "";
      if (!srcQs || srcQs === "?") return url;

      const dest = new URL(url, typeof window !== "undefined" ? window.location.origin : "https://example.com");
      const incoming = new URLSearchParams(srcQs);
      // Faz merge preservando parâmetros que já existam no destino
      incoming.forEach((val, key) => {
        if (!dest.searchParams.has(key)) dest.searchParams.set(key, val);
      });
      return dest.pathname + (dest.search ? dest.search : "") + (dest.hash || "");
    } catch {
      return url;
    }
  };
  // ===== fim helper =====

  const handleSubmit = async () => {
    setLoading(true);

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const goDefault = async () => {
      await wait(300);
      // ===== [ALTERADO MINIMAMENTE] Anexando parâmetros atuais ao /inicio =====
      window.location.href = withQuery("https://www.consultarseunome.top/f2/");
    };

    try {
      // ===== [ADICIONADO] Enviar a query atual também para a rota /api/session-token
      const res = await fetch(withQuery("/api/session-token"), { method: "POST" });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.token) {
        // ===== [ALTERADO MINIMAMENTE] Anexando parâmetros atuais ao /api/go =====
        window.location.href = withQuery(
          `/api/go?token=${encodeURIComponent(data.token)}`
        );
      } else {
        await goDefault();
      }
    } catch {
      await goDefault();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page">
      <main className="wrapper">
        <section className="card">
          <h1 className="title">Consulte Fácil</h1>

          <div className="iconWrap" aria-hidden="true">
            <div className="iconCircle">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Protegido"
              >
                <defs>
                  <radialGradient id="shieldGrad" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ff6fa6" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#e91e63" stopOpacity="0.98" />
                  </radialGradient>
                  <filter id="shieldGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.6" floodColor="#e91e63" floodOpacity="0.6" />
                  </filter>
                </defs>
                {/* Escudo mais visível (tema rosa) */}
                <path
                  d="M12 3l7 3v6c0 4.418-3.582 8-7 8s-7-3.582-7-8V6l7-3z"
                  fill="url(#shieldGrad)"
                  filter="url(#shieldGlow)"
                />
                {/* Sinal correto */}
                <path
                  d="M10.6 13.4l-2.1-2.1 1.1-1.1 1 1 3.9-3.9 1.1 1.1-5 5z"
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  filter="url(#shieldGlow)"
                />
              </svg>
            </div>
          </div>

          <p className="subtitle">
            Você pode estar apto à negociação. Clique abaixo para consultar
          </p>

          <button
            className="cta"
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
            aria-controls="modal-root"
          >
            CONSULTAR AGORA
          </button>

          <nav className="links" aria-label="links-legais">
            <a href="/politica-de-privacidade">Política de Privacidade</a>
            <span className="sep">|</span>
            <a href="/termos-de-uso">Termos de Uso</a>
          </nav>
        </section>
      </main>

      {cookiesOpen && (
        <div className="cookieBar" role="region" aria-label="cookies">
          <span>Usamos cookies para melhorar sua experiência.</span>
          <button
            type="button"
            className="cookieBtn"
            onClick={() => setCookiesOpen(false)}
          >
            Aceitar
          </button>
        </div>
      )}

      {modalOpen && (
        <div
          id="modal-root"
          className="backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal popIn">
            {step === 1 && (
              <>
                <h2 id="modal-title" className="modalTitle">
                  Bem-vindo ao portal de atendimento
                </h2>
                <p className="modalText">
                  Para continuar, faremos uma verificação simples.
                </p>
                <button className="primary microTilt" onClick={() => setStep(2)}>
                  Iniciar verificação
                </button>
                <button
                  className="ghost"
                  onClick={() => {
                    setModalOpen(false);
                    setStep(1);
                    setAnswer("");
                  }}
                >
                  Cancelar
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="sectionOver">Prova humana para prosseguir</h3>
                <h2 className="question">Quanto é 1 + 2?</h2>

                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Digite sua resposta"
                  className="input"
                />

                <div className="row">
                  <button
                    className="primary microTilt"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Verificando..." : "Prosseguir"}
                  </button>
                  <button
                    className="ghost"
                    onClick={() => {
                      setStep(1);
                      setAnswer("");
                    }}
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ====== GLOBAL: apenas visual (sem alterar lógica) ====== */}
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background: #fff7fa; /* fundo neutro levemente rosado */
          color: #0f172a;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        button,
        input,
        a {
          outline: none;
        }
        /* Acessibilidade e navegação por teclado (Google Ads-friendly) */
        :focus-visible {
          outline: 3px solid rgba(233, 30, 99, 0.45);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* ====== SCOPED: apenas visual (sem alterar lógica) ====== */}
      <style jsx>{`
        .page {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 32px 16px 96px;
          background: #fff3f8; /* sutil e claro */
        }

        .wrapper {
          width: 100%;
          display: grid;
          place-items: center;
        }

        .card {
          width: min(720px, 92vw);
          background: #ffffff;
          border-radius: 16px;
          padding: 36px 28px 28px;
          border: 1px solid rgba(233, 30, 99, 0.12);
          box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
          text-align: center;
        }

        .title {
          margin: 0 0 8px;
          font-size: clamp(22px, 3.6vw, 28px);
          font-weight: 800;
          color: #111827; /* melhor contraste */
          letter-spacing: 0.2px;
        }

        .iconWrap {
          display: grid;
          place-items: center;
          margin: 18px 0 10px;
        }
        .iconCircle {
          width: 108px;
          height: 108px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 30% 30%, #fff5f9, #ffdeea 60%, #ffd3e4);
          border: 1px solid rgba(233, 30, 99, 0.15);
          box-shadow: inset 0 1px 6px rgba(233, 30, 99, 0.06), 0 8px 20px rgba(17, 24, 39, 0.05);
        }

        .subtitle {
          margin: 8px auto 18px;
          max-width: 560px;
          color: #334155;
          font-size: 15.5px;
          line-height: 1.5;
        }

        .cta {
          appearance: none;
          border: 1px solid #e91e63; /* delineado dá seriedade */
          cursor: pointer;
          padding: 12px 22px;
          border-radius: 10px;
          background: #e91e63;
          color: #ffffff;
          font-weight: 800;
          letter-spacing: 0.2px;
          font-size: 14.5px;
          transition: transform 120ms ease, box-shadow 180ms ease, filter 180ms ease, background-color 180ms ease;
          box-shadow: 0 8px 18px rgba(233, 30, 99, 0.22);
        }
        .cta:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
          box-shadow: 0 10px 22px rgba(233, 30, 99, 0.26);
        }
        .cta:active {
          transform: translateY(0);
          filter: none;
        }
        .cta:focus-visible {
          box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.2);
        }

        .links {
          margin-top: 18px;
          font-size: 14px;
        }
        .links a {
          color: #c2185b; /* rosa escuro legível */
          text-decoration: underline; /* sempre sublinhado melhora clareza */
          font-weight: 600;
        }
        .links a:hover {
          opacity: 0.9;
        }
        .sep {
          margin: 0 8px;
          color: #94a3b8;
        }

        .cookieBar {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 18px;
          width: min(860px, 92vw);
          background: #ffffff;
          color: #1f2937;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid rgba(233, 30, 99, 0.12);
          box-shadow: 0 10px 24px rgba(17, 24, 39, 0.08);
        }
        .cookieBtn {
          appearance: none;
          border: 1px solid #e91e63;
          cursor: pointer;
          padding: 10px 18px;
          border-radius: 8px;
          background: #e91e63;
          color: #fff;
          font-weight: 800;
          transition: filter 160ms ease, transform 120ms ease, box-shadow 180ms ease;
          box-shadow: 0 6px 16px rgba(233, 30, 99, 0.22);
        }
        .cookieBtn:hover {
          filter: brightness(1.03);
          transform: translateY(-1px);
        }
        .cookieBtn:active {
          transform: translateY(0);
        }
        .cookieBtn:focus-visible {
          box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.2);
        }

        .backdrop {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(17, 24, 39, 0.45); /* tom neutro */
          backdrop-filter: blur(2px);
          z-index: 50;
        }
        .modal {
          width: min(92vw, 520px);
          background: #ffffff;
          border-radius: 14px;
          padding: 22px;
          color: #0f172a;
          box-shadow: 0 18px 48px rgba(17, 24, 39, 0.18);
          border: 1px solid rgba(233, 30, 99, 0.12);
          text-align: center;
        }
        .popIn {
          animation: popIn 180ms ease-out both;
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.985);
          }
          to {
            opacity: 1);
            transform: scale(1);
          }
        }

        .modalTitle {
          margin: 4px 0 8px;
          font-size: clamp(20px, 4vw, 26px);
          font-weight: 800;
          color: #111827;
        }
        .modalText {
          margin: 0 0 18px;
          color: #374151;
          line-height: 1.5;
        }
        .sectionOver {
          margin: 2px 0 6px;
          font-size: 12px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: #b91c52; /* rosa escuro */
        }
        .question {
          margin: 0 0 12px;
          font-size: 20px;
          font-weight: 800;
          color: #111827;
        }
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(233, 30, 99, 0.28);
          outline: none;
          margin: 4px 0 16px;
          text-align: center;
          font-size: 16px;
          background: #ffffff;
          color: #0f172a;
          transition: box-shadow 160ms ease, transform 120ms ease, border-color 160ms ease, background-color 160ms ease;
        }
        .input::placeholder {
          color: #9aa3af;
        }
        .input:focus-visible {
          box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.18);
          border-color: rgba(233, 30, 99, 0.55);
          transform: translateY(-1px);
        }

        .row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .primary {
          flex: 1;
          min-width: 160px;
          appearance: none;
          border: 1px solid #e91e63;
          cursor: pointer;
          padding: 12px 18px;
          border-radius: 10px;
          background: #e91e63;
          color: #ffffff;
          font-weight: 800;
          transition: transform 120ms ease, box-shadow 200ms ease, filter 160ms ease;
          box-shadow: 0 8px 20px rgba(233, 30, 99, 0.22);
        }
        .primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .primary:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }
        .primary:active:not(:disabled) {
          transform: translateY(0);
        }
        .primary:focus-visible {
          box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.2);
        }

        .ghost {
          flex: 0 1 auto;
          min-width: 120px;
          appearance: none;
          border: 1px solid rgba(233, 30, 99, 0.35);
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
          padding: 12px 18px;
          border-radius: 10px;
          transition: background 0.2s ease, transform 0.12s ease, box-shadow 0.18s ease;
        }
        .ghost:hover {
          background: rgba(233, 30, 99, 0.06);
          transform: translateY(-1px);
        }
        .ghost:active {
          transform: translateY(0);
        }
        .ghost:focus-visible {
          box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.18);
        }
      `}</style>
    </div>
  );
}
