---
title: Adding a CMS to my Hugo site
date: 2019-11-30T10:56:12.852Z
categories: ['Software Engineering']
---
![kata](/images/uploads/kata.jpg "Female karateka practicing a kata")

**Building a website is like the kata of Software Engineering**. Doing this repeatedly furthered my understanding of the Internet and Software in general.

Recently, I hence built this [terraform + Wordpress script](https://github.com/louisguitton/devopsless.com) to spin up a landing page in seconds in a partly new and partly similar way to which I had created websites previously. And this lead me to a particular question.

> How to get the best of both worlds between a CMS like Wordpress and a Static Site Generator like Hugo?

Here is what I mean: a Hugo site has git sync and its deployment is centered around CI/CD like any other software, but on the other hand, having a CMS lets non-technical people create content. This is what you need when you build a landing page for a potential non technical co-founder like I had to last year. So I asked: **is there a way to add a CMS on top of a Hugo site?**

It turns out there is, and I quickly found this index page of [CMS for static site generators](https://headlesscms.org/). I then implemented https://www.netlifycms.org/ and this post has been written with it =)
