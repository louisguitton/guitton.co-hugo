# guitton.co

> Personal website 2.0 leveraging serverless

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/louisguitton/guitton-co)
[![Netlify Status](https://api.netlify.com/api/v1/badges/f4b88da3-5ca0-4375-ba53-f53844d37d25/deploy-status)](https://app.netlify.com/sites/gracious-ardinghelli-343afa/deploys)

## Development

```bash
netlify dev --live
```

or

```bash
hugo serve -D
```

## Deployment

### Frontend

```bash
git push
```

### Backend

```bash
cd serverless
sls deploy -v
```

## Todo

- add check for title, summary, keywords and images in front matter
- add check for clean link names using SEO title
- add check for images alt
