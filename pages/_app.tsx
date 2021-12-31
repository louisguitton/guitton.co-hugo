import { NextSeo } from "next-seo";
import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Page from "../components/Page";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>guitton.co</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Ref: https://github.com/garmeeh/next-seo#add-seo-to-page */}
      <NextSeo
        title="guitton.co"
        description="Welcome to the club. Your exclusive NFT of the brand new OFC Jersey 2022."
        openGraph={{
          url: "",
          title: "guitton.co",
          description:
            "Welcome to the club. Your exclusive NFT of the brand new OFC Jersey 2022.",
          type: "website",
          locale: "en_IE",
          images: [
            {
              url: "/Composite_OFxOFC.png",
              width: 600,
              height: 600,
              alt: "OneFootball Club",
              type: "image/png",
            },
          ],
          site_name: "guitton.co",
        }}
        twitter={{
          handle: "@OneFootball",
          site: "@OneFootball",
          cardType: "summary_large_image",
        }}
      />

      <Page>
        <Component {...pageProps} />
      </Page>
    </>
  );
}

export default MyApp;
