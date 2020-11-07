---
title: "A containerised HTTPS Flask API"
date: 2019-08-15
categories:
  - Code
weight: 1
---

## Problem

I was wrapping things up for my freelance clients before holidays, and I had to migrate a dockerized flask API to HTTPS.

I knew how to do it with nginx + python on the server, but I researched a reproducible way to do it with nginx + docker.

Then I started pulling the thread and first creating a docker-compsoe setup for nginx + the flask API.  But then you still need to manage your SSL certificates “manually” on the server with certbot.

I ended up with something pretty cool that I can reuse from now on: a docker-compose setup with certbot + nginx + flask, all in one.

## References

- [Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)
- [How to setup your website for that sweet, sweet HTTPS with Docker, Nginx, and letsencrypt](https://www.freecodecamp.org/news/docker-compose-nginx-and-letsencrypt-setting-up-website-to-do-all-the-things-for-that-https-7cb0bf774b7e/)

## Reusable Solution

{{< gist louisguitton 6682f1190ef594b82f5804c2e81c50ac >}}
