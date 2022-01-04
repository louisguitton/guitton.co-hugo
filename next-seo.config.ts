/**
 * SEO default config using next-seo, can be overriden on a page by page basis.
 * References:
 * - https://github.com/garmeeh/next-seo#nextseo-options
 * - https://github.com/garmeeh/next-seo#default-seo-configuration */
import { DefaultSeoProps } from "next-seo/lib/types";

const siteName = "guitton.co";
const title = "not Louis Vuitton";
const description =
  "I blog about python software development, machine learning, data engineering, and flow blockchain development.";
const image = "/images/louis.jpg";
const keywords = [
  "blog",
  "nlp",
  "machine learning",
  "data engineering",
  "python",
  "blockchain",
];

const seoConfig: DefaultSeoProps = {
  title: title,
  titleTemplate: `${siteName} | %s`,
  description: description,
  openGraph: {
    title: siteName,
    description: description,
    type: "website",
    locale: "en_IE",
    images: [
      {
        url: image,
        width: 224,
        height: 224,
        alt: "Louis Guitton",
        type: "image/jpg",
      },
    ],
    site_name: siteName,
  },
  twitter: {
    // @username for the content creator / author (outputs as `twitter:creator`)
    handle: "@louis_guitton",
    // @username for the website used in the card footer
    site: "@louis_guitton",
    cardType: "summary_large_image",
    // Twitter will read the `og:title`, `og:image` and `og:description` tags for their card,
    // this is why next-seo omits `twitter:title`, `twitter:image` and `twitter:description` so not to duplicate.
  },
  additionalMetaTags: [
    { name: "keywords", content: keywords.join(",") },
    // TODO: add "og:updated_time" ?
  ],
};

export default seoConfig;
