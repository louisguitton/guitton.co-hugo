# guitton.co

## References

Next + Contentlayer

- https://github.com/contentlayerdev/next-contentlayer-example

Next + markdown

- https://github.com/vercel/next.js/blob/canary/examples/blog-starter
- https://github.com/timlrx/tailwind-nextjs-starter-blog
- https://nextjs.org/learn/basics/dynamic-routes/render-markdown
- https://github.com/forestryio/next-blog-forestry

## TODO

- [ ] generate sitemap.xml https://github.com/leerob/leerob.io/blob/main/scripts/generate-sitemap.mjs
  - [ ] compare with https://guitton.co/sitemap.xml
- [ ] generate rss.xml https://github.com/leerob/leerob.io/blob/main/scripts/generate-rss.mjs
  - [ ] compare with https://guitton.co/index.xml
- [ ] build OK reading experience for the body using either markdown plugins or custom CSS
  - https://github.com/leerob/leerob.io/blob/main/styles/global.css#L66-L115
  - https://github.com/leerob/leerob.io/blob/main/contentlayer.config.ts#L87-L102
- [ ] add Google Analytics
- [ ] add breadcrumbs https://tailwindui.com/components/application-ui/navigation/breadcrumbs

- [ ] setup about and other pages to use contentlayer OtherPage model
- [ ] add SSG support for tweets

- [ ] add search page for the lolz https://docs.google.com/presentation/d/1Iqb4rz1txVASXHpdjwogbiDvetVkjI9GMa7lQoIh7j4/edit#slide=id.g10a562423c5_0_4
- [ ] add mentions page that combines:
  - [ ] https://www.reddit.com/search/?q=site%3Aguitton.co%20OR%20author%3Alaguitte%20OR%20selftext%3A%22guitton.co%22&sort=new
  - [ ] https://news.ycombinator.com/from?site=guitton.co
  - [ ] https://twitter.com/search?q=%22guitton.co%22%20OR%20%22louis%20guitton%22%20-from%3Alouis_guitton%20-%40louis_guitton%20-bag%20-purse%20-from%3Alouisguitton&src=typed_query&f=live
