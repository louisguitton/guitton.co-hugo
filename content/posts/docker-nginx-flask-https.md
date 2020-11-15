---
title: "A containerised HTTPS Flask API"
date: 2019-08-15
lastmod: 2020-11-09
summary: In this post, I show my setup for a dockerised HTTPS Flask API.
  It generates and renews the SSL certificates automatically and includes the nginx config.
keywords:
  - flask https
  - docker flask https
  - flask letsencrypt
  - flask ssl
  - docker nginx letsencrypt
  - flask nginx docker
categories:
  - Code
featuredImage: /images/slask_https.png
images:
  - /images/slask_https.png
series:
  - top posts
---

![HTTPS Flask API with SSL certificates](/images/slask_https.png "HTTPS Flask API with SSL certificates")

## Turnkey dockerised setup for an HTTPS Flask API with SSL certificates included

I was wrapping things up for my freelance clients before holidays, and I had to migrate a dockerized flask API to HTTPS.

I knew how to do it with nginx + python on the server, but I researched a reproducible way to do it with nginx + docker.

Then I started pulling the thread and first creating a docker-compsoe setup for nginx + the flask API.  But then you still need to manage your SSL certificates “manually” on the server with certbot.

I ended up with something pretty cool that I can reuse from now on: a docker-compose setup with certbot + nginx + flask, all in one.

## Reusable Solution

The following gist is made of 3 parts:

1. a docker compose setup sith `nginx`, `certbot` and `flask`
1. a setup shell script that manages the SSL certificates generation
1. a nginx configuration supporting HTTPS

You will need to tweak the hardcoded balues that point to my service `startup-meter.louisguitton.com`.

{{< gist louisguitton 6682f1190ef594b82f5804c2e81c50ac >}}

## References

1. [Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes | by Philipp | Medium](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)
1. [How to setup your website for that sweet, sweet HTTPS with Docker, Nginx, and letsencrypt](https://www.freecodecamp.org/news/docker-compose-nginx-and-letsencrypt-setting-up-website-to-do-all-the-things-for-that-https-7cb0bf774b7e/)
