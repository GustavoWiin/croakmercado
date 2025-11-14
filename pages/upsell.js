// pages/upsell.js
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function UpsellRedirect() {
  useEffect(() => {
    const query = typeof window !== "undefined" ? window.location.search : "";

    // Lê upsell salvo no localStorage
    let upsell = "up1";
    try {
      const v = localStorage.getItem("upsell");
      const allowed = new Set(["up1", "up2", "up3", "up4", "up5", "up6", "obg"]);
      if (v && allowed.has(v)) upsell = v;
    } catch (_) {}

    const destBase = "https://meunometemcoisa.online/up/";
    const redirectUrl = `${destBase}${upsell}/${query || ""}`;

    // Verifica utm_campaign
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const campaign = urlParams.get("utm_campaign");

      if (campaign === "22981143525") {
        // Dispara conversão com callback
        window.gtag?.("event", "conversion", {
          send_to: "AW-17489686170/TRdICKDPgokbEJrd3ZNB",
          value: 35.0,
          currency: "BRL",
          transaction_id: "",
          event_callback: () => {
            window.location.replace(redirectUrl);
          },
        });

        return; // não segue direto, espera o callback
      }
    } catch (e) {}

    // fallback padrão
    window.location.replace(redirectUrl);
  }, []);

  return (
    <>
      <Head>
        <title>Redirecionando…</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          html, body, #__next { height: 100%; }
          body {
            display:flex; align-items:center; justify-content:center;
            background:#254DDB; margin:0;
          }
          .spinner {
            width:50px; height:50px; border:5px solid rgba(255,255,255,.3);
            border-radius:50%; border-top-color:#fff; animation:spin 1s linear infinite;
          }
          @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        `}</style>
      </Head>

      {/* Global Tag Google Ads */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17489686170"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'AW-17489686170');
        `}
      </Script>

      <div className="spinner" />
    </>
  );
}
