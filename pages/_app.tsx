import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Page from "../components/Page";
import SEO from "../next-seo.config";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Ref: https://css-tricks.com/svg-favicons-and-all-the-fun-things-we-can-do-with-them/ */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <DefaultSeo {...SEO} />
      <SocialProfileJsonLd
        type="Person"
        name="Louis Guitton"
        // App currently does not support Next.js Data Fetching methods like getStaticProps or getServerSideProps.
        // Ref: https://nextjs.org/docs/advanced-features/custom-app#caveats
        url="https://guitton.co"
        sameAs={[
          "https://github.com/louisguitton",
          "https://twitter.com/louis_guitton",
          "https://discordapp.com/users/217929937842208768",
          "https://stackoverflow.com/users/3823815/louis-guitton",
          "https://linkedin.com/in/louisguitton/",
          "https://goodreads.com/user/show/58757583-louis",
        ]}
      />

      <Page>
        <Component {...pageProps} />
      </Page>
    </>
  );
}

export default MyApp;
