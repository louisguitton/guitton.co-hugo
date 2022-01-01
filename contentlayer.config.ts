// Ref: https://github.com/leerob/leerob.io/blob/main/contentlayer.config.ts
import {
  defineDocumentType,
  makeSource,
  ComputedFields,
} from "contentlayer/source-files";

const computedFields: ComputedFields = {
  fnSlug: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
  },
};

// Ref: https://gohugo.io/content-management/front-matter/#predefined
// Ref: https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
// Ref: https://github.com/contentlayerdev/contentlayer/blob/9f5e0c8c19b5ebf564af5e1159774b61e517dd75/packages/%40contentlayer/source-files/src/schema/defs/field.ts
const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "posts/*.mdx",
  bodyType: "mdx",
  fields: {
    slug: {
      type: "string",
      description:
        "appears as the tail of the output URL. A value specified in front matter will override the segment of the URL based on the filename.",
    },
    title: {
      type: "string",
      description: "the title for the content. Used for SEO",
      required: true,
    },
    date: {
      type: "date",
      description:
        "the datetime assigned to this page. Used to sort posts by publish time.",
      required: true,
    },
    lastmod: {
      type: "date",
      description:
        "the datetime at which the content was last modified. Used for SEO.",
      required: true,
    },
    summary: {
      type: "string",
      required: true,
      description:
        "text used when providing a summary of the article in the .Summary page variable; details available in the content-summaries section. Used for SEO.",
    },
    categories: {
      type: "list",
      description: "a categorization that can be used to classify content.",
      of: { type: "string" },
    },
    series: {
      type: "list",
      description:
        "an array of series this page belongs to, as a subset of the series taxonomy; used by the opengraph internal template to populate og:see_also.",
      of: { type: "string" },
    },
    image: {
      type: "string",
      description: "featured image of the post for SEO.",
      required: true,
    },
    draft: {
      type: "boolean",
      description:
        "if true, the content will not be rendered unless the --buildDrafts flag is passed to the hugo command.",
      default: false,
    },
  },
  computedFields,
}));

const OtherPage = defineDocumentType(() => ({
  name: "OtherPage",
  filePathPattern: "*.mdx",
  bodyType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "the title for the content. Used for SEO",
      required: true,
    },
    summary: {
      type: "string",
      required: true,
      description:
        "text used when providing a summary of the article in the .Summary page variable; details available in the content-summaries section. Used for SEO.",
    },
    lastmod: {
      type: "date",
      description:
        "the datetime at which the content was last modified. Used for SEO.",
      required: true,
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Blog, OtherPage],
});
