// Ref: https://github.com/leerob/leerob.io/blob/main/contentlayer.config.ts
// Ref: 
import { defineDocumentType, makeSource, ComputedFields } from 'contentlayer/source-files'

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '')
  }
};

const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'posts/*.mdx',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', description: 'The title of the post', required: true },
    publishedAt: { type: 'string', description: 'The date of publication', required: true },
    summary: { type: 'string', required: true },
    image: { type: 'string', required: true }
  },
  computedFields
}));

const OtherPage = defineDocumentType(() => ({
  name: 'OtherPage',
  filePathPattern: '*.mdx',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true }
  },
  computedFields
}));


export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, OtherPage],
})
