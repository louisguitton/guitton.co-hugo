import { NextSeo } from "next-seo";
import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Page from "../components/Page";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

// TODO: fix canonical URL
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Ref: https://css-tricks.com/svg-favicons-and-all-the-fun-things-we-can-do-with-them/ */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <DefaultSeo {...SEO} />

      <Page>
        <Component {...pageProps} />
      </Page>
    </>
  );
}

export default MyApp;
