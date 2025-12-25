import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { theme } from "../components/theme";

export default class Document extends NextDocument {
  static getInitialProps(ctx) {
    return NextDocument.getInitialProps(ctx);
  }

  render() {

    return (
      <Html>
        <Head>
          {/* <!-- Cloudflare Web Analytics --> */}
          {/* <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "18e8f09ab32c4e53b7ebc114b0c74169"}'></script> */}
          {/* <!-- End Cloudflare Web Analytics --> */}

          {/* <title>SkyHarbor | ENFT Marketplace</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />

            <meta name="twitter:card" content="Welcome to the premium NFT marketplace on the Ergo blockchain. Buy and sell NFT's with ease." key="twcard" />
            <meta name="twitter:creator" content={"@skyharbor_io"} key="twhandle" />

            <meta name="og:url" content={`https://www.skyharbor.io`} key="ogurl" />
            <meta name="og:image" content={"/assets/images/cloudgnome.webp"} key="ogimage" />
            <meta name="og:site_name" content={"SkyHarbor"} key="ogsitename" />
            <meta name="og:title" content="SkyHarbor | ENFT Marketplace" key="ogtitle" />
            <meta name="og:description" content="Welcome to the premium NFT marketplace on the Ergo blockchain. Buy and sell NFT's with ease." key="ogdesc" /> */}
        </Head>
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />

          <NextScript />
        </body>
      </Html>
    );
  }
}
