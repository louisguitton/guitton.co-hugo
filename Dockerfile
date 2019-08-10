# build site
FROM python:3.7-alpine as hugo_site_builder

ARG environment=development

# install hugo
ENV HUGO_VERSION=0.56.3
ADD https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz /tmp/
RUN tar -xf /tmp/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -C /usr/local/bin/

COPY . /source
WORKDIR /source

# pull hugo theme's git submodule
RUN apk add git && git submodule update --init --recursive

# install syntax highlighting and jupyter dependency
RUN pip install --upgrade pip && pip install -r requirements.txt

# build static pages
RUN hugo --destination=/public/ --environment $environment

# serve site
FROM nginx:stable-alpine

ADD /nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=hugo_site_builder /public /usr/share/nginx/html

EXPOSE 80
