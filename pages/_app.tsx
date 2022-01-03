import { NextSeo } from "next-seo";
import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Page from "../components/Page";

const seoConfig = {
  title: "guitton.co - personal website of Louis Guitton, not Louis Vuitton",
  description:
    "I blog about python software development, machine learning, data engineering, and flow blockchain development.",
  baseUrl: "https://guitton.co",
  image: "https://guitton.co/images/louis.jpg",
};

// TODO: fix canonical URL
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>guitton.co</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Ref: https://css-tricks.com/svg-favicons-and-all-the-fun-things-we-can-do-with-them/ */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      {/* Ref: https://github.com/garmeeh/next-seo#add-seo-to-page */}
      <NextSeo
        title={seoConfig.title}
        description={seoConfig.description}
        canonical={seoConfig.baseUrl}
        // TODO: check if type = profile
        openGraph={{
          url: seoConfig.baseUrl,
          title: seoConfig.title,
          description: seoConfig.description,
          type: "website",
          locale: "en_IE",
          images: [
            {
              url: seoConfig.image,
              width: 224,
              height: 224,
              alt: "Louis Guitton",
              type: "image/jpg",
            },
          ],
          site_name: "guitton.co",
          profile: {
            firstName: "Louis",
            lastName: "Guitton",
            gender: "male",
          },
        }}
        twitter={{
          site: "@louis_guitton",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "blog,nlp,machine learning,data engineering,python,blockchain",
          },
          { name: "twitter:title", content: seoConfig.title },
          { name: "twitter:description", content: seoConfig.description },
          { name: "twitter:image", content: seoConfig.image },
          // TODO: add "og:updated_time" ?
        ]}
      />

      <Page>
        <Component {...pageProps} />
      </Page>
    </>
  );
}

export default MyApp;
