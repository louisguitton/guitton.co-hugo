---
slug: {{ .Name }}
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
summary: >
keywords:
    -
categories:
    -
featuredImage:
images:
    -
series:
    -
draft: true
# Ref: https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
# Ref: https://gohugo.io/content-management/front-matter
---


## Template

- A main keyword you want to write about
- A list of tail keywords and topics to include for a complete post
- A list of external sites you can link to
- An outline of your post with headlines and subheadlines
- A couple of ideas for your headline

### Adding notebooks

```bash
jupyter lab notebooks
jupyter nbconvert --to html notebooks/20190523-berliner_firmenlauf.ipynb
mv notebooks/20190523-berliner_firmenlauf.html content/posts/berliner_firmenlauf.html
# add hugo front matter
```

## Resources

1. [My link](url)
