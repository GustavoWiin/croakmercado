// pages/_app.js
import "../styles/globals.css";
import Script from "next/script";
import { useEffect } from "react";

// chaves que queremos capturar
const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"];
const COOKIE_NAME = "click_id_bundle";
const COOKIE_MAX_AGE_DAYS = 90;

// salva no cookie
function saveIdsToCookie(ids) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_MAX_AGE_DAYS);
  document.cookie = [
    `${encodeURIComponent(COOKIE_NAME)}=${encodeURIComponent(JSON.stringify(ids))}`,
    `Path=/`,
    `SameSite=Lax`,
    `Secure`,
    `Expires=${expires.toUTCString()}`
  ].join("; ");
}

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // captura da URL
    const params = new URLSearchParams(window.location.search);
    const ids = {};
    CLICK_ID_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) ids[k] = v;
    });

    if (Object.keys(ids).length > 0) {
      saveIdsToCookie(ids);
    }
  }, []);

  return (
    <>
      {/* Define a variável global antes do script externo */}
      <Script id="utmify-pixel-id" strategy="beforeInteractive">
        {`window.googlePixelId = "68c2ea3cbb2400157842452a";`}
      </Script>

      {/* Carrega o script do UTMify depois que a página estiver interativa */}
      <Script
        id="utmify-pixel"
        src="https://cdn.utmify.com.br/scripts/pixel/pixel-google.js"
        strategy="afterInteractive"
        defer
      />

      {/* Renderiza normalmente o app */}
      <Component {...pageProps} />
    </>
  );
}
