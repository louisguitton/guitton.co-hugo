---
slug: last-blog-post
title: "How did my last blog post perform?"
date: 2020-05-23
lastmod: 2020-11-09
categories:
  - Ideas
aliases:
  - /posts/how-good-was-my-last-blog-post/
---


Lately, I've been monitoring my website and trying to grow it organically.

{{< tweet 1248945877886087169 >}}

I post naturally almost once a month, but given I have limited time,
I'm interested in understanding how I can maximise the impact of one post on my website tracking data.

First (and we won't cover this here), you might wonder how to define success of you online project:

- number of organic clicks?
- number of returning visitors?
- number of conversions?

Once I had my metric, I was able to compare it to some of my previous projects and know this blog is more "successful".
I compared it to some of my previous companies, and know it's less "successful".

But really, I was looking at blogs I like out there, and thinking

> how far am I from this blog? how smaller am I right now?

## Enters plausible.io

As web tracking is a big part of the data world, and since I've been working (for jobs or on projects) with data for a while,
I've come across multiple website tracking tools already (e.g. Google Analytics, Google Search Console, Snowplow Analytics, Segment).

On April 8th, a new competing (and really cool) tool was launched **with a bang** on HackerNews: [plausible.io](https://plausible.io).

Here, I won't dive into its features or its inception story, but rather highlight 2 of its attributes which made me think:

1. although the project was started by a solo dev, he realised that **build it and they will come** is not true;
  instead he partnered with a content marketing expert as a co-founder,
  and given the tool's gained popularity, it's safe to say that this decision paid off
1. this tool pushes the **open data** movement further as devs can now share their tracking data directly
  on plausible. For example `myproject.com` would have its tracking available at `plausible.io/myproject.com`

You can see how that second point relates to the introduction of this post.

## Benchmarking web tracking data with capacitors

Here I intend to collect a growing list of website tracking data points. The goal is to help me
(and hopefully others) build a better sense of the kind of website traffic numbers you can expect, and how to compare them.

### plausible.io successful content marketing launch - 26k peak

[Analytics for plausible.io April 6th-13th](https://plausible.io/plausible.io?period=custom&from=2020-04-06&to=2020-04-13)

- on the day of the release 26k visitors came to the website of which 15k (~60%)
  came from the "hello world" post on HackerNews.
- on that week, the HackerNews post brought a total of 16k of the 46k (~35%) users (to be compared to the 15k of the first day).
  This means that the reach you get on HackerNews is limited to the launch day.
- But that content marketing strategy really paid off, as the post was also cited in the HackerNews newsletter.
  If was featured #2 of the top 10 "*Favorites*" that week. And we see that over the week, it brought 2k ouf of the 46k (~4%) users.
- the effect of such a viral post looks to me like a *capacitor discharge curve* with a time constant a bit shorter
  than a day. This electronics jargon means that after 3 to 4 days, you're back at the normal organic traffic.
- organic traffic before was averaging at ~100 users per day; and after was averaging at ~1k users per day.
  So that successful content piece 10-folded the organic traffic.
- finally, twitter is still a very big source of referrals (number 2 after Hackernews and before Hackernewsletter).
  Unfortunately, you will get only the tweeter shortened link as a source of referral (instead of the tweet)
  so it might be hard to figure out what tweets worked for you.

More details here:
{{< tweet 1252143221586657280 >}}

### koaning.io successful blog post - 8k peak

[Analytics for koaning.io April 27th-May4th](https://plausible.io/koaning.io?period=custom&from=2020-04-27&to=2020-05-04)

- although we're talking about a blog post and not a product launch, we're observing similar patterns
- the *capacitor discharge curve* is there, with a 8k peak and overall 10k users that week
- HackerNews was the main traffic referrer, bringing ~75% of the traffic that week in just 1 day.

### guitton.co successful blog post - 45 peak

[Analytics for guitton.co March 20th-27th](/others/web_analytics_guittonco_20200320-20200327.pdf)

- we see the *capacitor discharge curve* as well. With a 45 users peak and overall 100 users that week
- my top referrer was a tweet I did with 60% of the users (the equivalent of Hackernews for koaning.io and plausible.io)
- the reason why that tweet worked well was that I tagged the right hashtag (#NLProc) and a couple of people
  that might be interested in retweeting it (and they did)

{{< tweet 1241799913178095616 >}}

## My blog is smaller, but how much so ?

So, we saw here the power of **Content Marketing** for any online project (a personal blog or a SaaS launch).
A new post can bring a "peak" of users that we modelled as a *capacitor discharge curve* in this post.

![capacitor_discharge](/images/capacitor_discharge.jpg "Capacitor discharge model for content marketing")

The idea is that blogs of any size will experience that same exponential discharge.
So if you measure the discharge curve's characteristics (amplitude and characteristic time), you can get an idea of the **size factor between 2 blogs**.
By looking at the 3 analytics reports above, we saw 2 things:

1. the characteristic time mostly doesn't vary across blogs
1. the characteristic time is roughly of 1 day (you can eyeball it for simplicity)

So this means you only need to measure the amplitude of the peak to compare blogs with each other.

> ⚠️ Warning note: before doing this exercise on your own website, know that this can hurt your ego, but it's fine

In my case, because my peak brought ~40 users and koaning.io's peak brought ~8000 users, I now know that **my blog is 200 times smaller**.

## Conclusion

Full disclaimer, this appraoch is simplistic and I have not looked for literature that models Content Marketing this way.
Here are a couple issues I can see:

- I look at 1 isolated content outreach and not recurring content outreachs (maybe over multiple outreachs that discharge curve doesn't look the same)
- I also assume that all content referrers are equal: Twitter was "my HackerNews" in this post. But is this true? If you have a database of customers email addresses, is an email outreach more efficient? Is a mobile push notification in your native app behaving the same etc...?

Despite all that, I hope I gave you a quick way to eyeball the success of your last content outreach and to gauge how much work you still need to put in to reach the numbers you're after 😀!
