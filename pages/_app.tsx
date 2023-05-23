import { AppProps } from "next/app";
import Head from "next/head";
import Script from 'next/script';

export default function MyApp({ Component, pageProps }:AppProps) {
  return <>
    <Head>
       <Script id="gtm" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PZD5TNF');
        `}
      </Script>
    </Head>
    <body>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PZD5TNF"
          height="0"
          width="0"
          style={{
            display: 'none',
            visibility: 'hidden',
          }}
        ></iframe>
      </noscript>
<Component {...pageProps} />
    </body>
  </>
}