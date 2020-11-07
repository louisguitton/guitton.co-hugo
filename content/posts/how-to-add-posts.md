---
title: "How to add a post to this website"
draft: true
---

## Front matter links

- https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
- https://gohugo.io/content-management/front-matter

## Template

- A main keyword you want to write about
- A list of tail keywords and topics to include for a complete post
- A list of external sites you can link to
- An outline of your post with headlines and subheadlines
- A couple of ideas for your headline

## Content

### Add Markdown

### Add HTML

### Add notebook

```bash
jupyter lab notebooks
jupyter nbconvert --to html notebooks/20190523-berliner_firmenlauf.ipynb
mv notebooks/20190523-berliner_firmenlauf.html content/posts/berliner_firmenlauf.html
# add hugo front matter
```
