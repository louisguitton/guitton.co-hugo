---
title: "How to use spaCy language models in Russian or Swedish"
date: 2020-03-22
lastmod: 2020-11-08
summary:
  I demo how you can use spaCy in 70+ languages by leveraging Stanza, a NLP toolkit by StandfordNLP. I give spaCy NER examples in Russian and Swedish.
keywords:
  - stanza vs spacy
  - spacy ner
  - spacy swedish
  - spacy russian
  - spacy swedish model
  - spacy russian language
  - standfordnlp
  - stanza pipeline
  - textrank spacy
  - spacy noun_chunks
categories:
  - ML
featuredImage: https://www.arsenal.com/sites/default/files/styles/player_featured_image_1045x658/public/gun__1416482723_arsh.jpg
images:
  - https://www.arsenal.com/sites/default/files/styles/player_featured_image_1045x658/public/gun__1416482723_arsh.jpg
  - /images/arshavin.png
  - https://www.welt.de/img/sport/fussball/mobile183435048/6811357887-ci16x9-w1300/PSG-s-Zlatan-Ibrahimovic-during-the-First-League-Champion-PSG-Na.jpg
  - /images/zlatan.png
series:
  - top posts
---

## spaCy NER in more than 12 Languages

Let's say you want to do Named Entity Recognition (NER) in Russian or Swedish. You first look at NLP APIs.

Unfortunately, **cloud providers only provide NLP models in a few languages**:

- AWS Comprehend covers 12 languages; neither Russian or Swedish are supported [(source)](https://docs.aws.amazon.com/comprehend/latest/dg/supported-languages.html#supported-languages-feature)
- Google Cloud Natural Language covers 11 languages; Russian is supported but not Swedish [(source)](https://cloud.google.com/natural-language/docs/languages#entity_analysis)

Fortunately, you can now expand beyond those 12 languages and **tap into language models in more than 70 languages**.

This week, StanfordNLP released v1.0.0 of `Stanza`, their NLP toolkit in 70+ languages. [Paper](https://paperswithcode.com/paper/stanza-a-python-natural-language-processing)

{{< tweet 1239982230203764738 >}}

It was previously known as `StandfordNLP` and apparently went through a little renaming.
Stanza has a meaning borrowed from poetry and starts with "stan" like Stanford I guess:

> In poetry, a stanza is a grouped set of lines within a poem, usually set off from other stanzas
by a blank line or indentation. Stanzas can have regular rhyme and metrical schemes,
though stanzas are not strictly required to have either.

What's even more awesome is that Explosion quickly followed with the release of their `spaCy` wrapper to `Stanza`.

```sh
pip install spacy-stanza
```

So in the rest of this article, I will show how to do NER in Russian and Swedish using Stanza and spaCy.

## Spacy vs Stanza

In a [Hacker News post](https://news.ycombinator.com/item?id=22683184) from March 25,
spaCy's author himself writes :

> Our models are quite a bit behind state-of-the-art atm because we're still optimized for CPU.

He then explains the design choices spaCy made in more details before concluding:

> The bottom-line anyone should care about is, "Am I likely to see **a difference in accuracy
between Stanza and spaCy** on my problem". At the moment I think the answer is "yes".
(Although spaCy's default models are still cheaper to run on large datasets).
>
> We're a bit behind the current research atm, and the improvements from that research are
definitely real. We're looking forward to releasing new models, but in the meantime you can
also use the Stanza models with very little change to your spaCy code, to see if they help on your problem.

## Spacy in Russian: How to Find Lemmas or Entities

Let's try to parse a Russian document. I head over to Wikipedia and look for the [Arshavin page](https://ru.wikipedia.org/wiki/%D0%90%D1%80%D1%88%D0%B0%D0%B2%D0%B8%D0%BD,_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B9_%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B5%D0%B2%D0%B8%D1%87).

Arshavin is a famous Russian player that I used to follow when he played for Arsenal.

![arshavin](https://www.arsenal.com/sites/default/files/styles/player_featured_image_1045x658/public/gun__1416482723_arsh.jpg)

```sh
# Russian requires an additional dependency
pip install pymorphy2==0.8
```

```python
>>> import stanza
>>> from spacy_stanza import StanzaLanguage
>>> from spacy import displacy
>>> stanza.download('ru')
Downloading https://raw.githubusercontent.com/stanfordnlp/stanza-resources/master/resources_1.0.0.json: 116kB [00:00, 2.96MB/s]
2020-03-18 14:38:35 INFO: Downloading default packages for language: ru (Russian)...
Downloading http://nlp.stanford.edu/software/stanza/1.0.0/ru/default.zip: 100%|██████████| 591M/591M [09:11<00:00, 1.07MB/s]
2020-03-18 14:47:55 INFO: Finished downloading models and saved to /Users/louis.guitton/stanza_resources.
>>> snlp = stanza.Pipeline(lang="ru")
>>> nlp = StanzaLanguage(snlp)
2020-03-18 15:05:49 INFO: Loading these models for language: ru (Russian):
=========================
| Processor | Package   |
-------------------------
| tokenize  | syntagrus |
| pos       | syntagrus |
| lemma     | syntagrus |
| depparse  | syntagrus |
| ner       | wikiner   |
=========================

2020-03-18 15:05:49 INFO: Use device: cpu
2020-03-18 15:05:49 INFO: Loading: tokenize
2020-03-18 15:05:49 INFO: Loading: pos
2020-03-18 15:05:50 INFO: Loading: lemma
2020-03-18 15:05:50 INFO: Loading: depparse
2020-03-18 15:05:51 INFO: Loading: ner
2020-03-18 15:05:52 INFO: Done loading processors!
>>> text = """Андре́й Серге́евич Арша́вин (род. 29 мая 1981[4], Ленинград) — российский футболист, бывший капитан сборной России, заслуженный мастер спорта России (2008). Выступал на позициях атакующего полузащитника, второго нападающего, плеймейкера. При тренере Гусе Хиддинке был одним из основных игроков сборной России. В 2008 году после чемпионата Европы 2008 года попал в символическую сборную Европы по версии УЕФА, а 2 декабря, в результате голосования на определение лучшего игрока 2008 года и вручение награды «Золотой мяч» по версии журнала «France Football», занял 6-е место, что является лучшим результатом для российского футболиста после распада СССР. Неоднократно признавался лучшим футболистом России в различных опросах. С 5 декабря 2009 года входит в «Клуб 100 российских бомбардиров»."""
>>> doc = nlp(text)
>>> displacy.render(doc, style="ent")
```

![arshavin](/images/arshavin.png "Russian document parsed with NER entities")

## Spacy in Swedish: How to Find Keywords

Now, let's try to parse a Swedish document. Once again, I head over to Wikipedia and look for the [Ibrahimovic page](https://sv.wikipedia.org/wiki/Zlatan_Ibrahimovi%C4%87).

Ibrahimovic was playing for Paris while I lived there.

![ibra](https://www.welt.de/img/sport/fussball/mobile183435048/6811357887-ci16x9-w1300/PSG-s-Zlatan-Ibrahimovic-during-the-First-League-Champion-PSG-Na.jpg)

```python
>>> stanza.download('sv')
Downloading https://raw.githubusercontent.com/stanfordnlp/stanza-resources/master/resources_1.0.0.json: 116kB [00:00, 3.38MB/s]
2020-03-19 07:16:01 INFO: Downloading default packages for language: sv (Swedish)...
Downloading http://nlp.stanford.edu/software/stanza/1.0.0/sv/default.zip: 100%|██████████| 225M/225M [03:36<00:00, 1.04MB/s]
2020-03-19 07:19:43 INFO: Finished downloading models and saved to /Users/louis.guitton/stanza_resources.
>>> snlp = stanza.Pipeline(lang="sv")
>>> nlp = StanzaLanguage(snlp)
2020-03-19 07:49:43 INFO: Loading these models for language: sv (Swedish):
=========================
| Processor | Package   |
-------------------------
| tokenize  | talbanken |
| pos       | talbanken |
| lemma     | talbanken |
| depparse  | talbanken |
=========================

2020-03-19 07:49:43 INFO: Use device: cpu
2020-03-19 07:49:43 INFO: Loading: tokenize
2020-03-19 07:49:43 INFO: Loading: pos
2020-03-19 07:49:44 INFO: Loading: lemma
2020-03-19 07:49:44 INFO: Loading: depparse
2020-03-19 07:49:45 INFO: Done loading processors!
>>> text = """Zlatan Ibrahimović, född 3 oktober 1981 i Västra Skrävlinge församling i Malmö, är en svensk fotbollsspelare. Ibrahimović har tilldelats Guldbollen elva gånger och anses allmänt vara Sveriges bäste fotbollsspelare genom tiderna. Från 2001 till 2016 spelade han i svenska landslaget, där han med sina 62 mål är den främste målgöraren genom tiderna. Under sina 18 år som utlandsproffs har svensken vunnit ligan vid elva tillfällen med fem olika klubbar i fyra länder och blivit skyttekung i italienska Serie A två gånger och i franska Ligue 1 vid tre tillfällen. Ibrahimović är den ende som spelat för sju olika klubbar i Champions League, där han med sina 48 mål också intar en delad niondeplats i skytteligans maratontabell. Hans främsta internationella merit är segern i Europa League med Manchester United 2016/2017. Svenskens övergång från Inter till Barcelona 2009 var den spanska storklubbens dittills dyraste spelarköp (69 miljoner euro). 2015 var Ibrahimović enligt tidskriften Forbes den 55:e bäst betalda kändisen i världen, med en årsinkomst på 39 miljoner dollar. I september 2018 gjorde Ibrahimović sitt 500:e mål och blev därmed en av 28 spelare i fotbollshistorien som gjort minst 500 mål (landslag och klubblag)."""
```

Contrary to Russian, the Swedish `stanza` model doesn't have a NER model (yet). You can double check available
NER models [here](https://stanfordnlp.github.io/stanza/models.html).

But the really cool thing for Swedish is that noun chunks rules are available in spacy (not the case for Russian)

> Tip: To check if noun chunks are available for one language in spacy, look for a `syntax_iterators.py` file
in the language folder (eg `spacy.lang.sv`)

Why does it matter whether a document has noun chunks or not ? Well, if `doc.noun_chunks` are available,
you can then use the awesome [pytextrank](https://github.com/DerwenAI/pytextrank) library to extract
the top keywords.

```sh
pip install pytextrank
```

```python
>>> tr = pytextrank.TextRank()
>>> nlp.add_pipe(tr.PipelineComponent, name="textrank", last=True)  # add PyTextRank to the spaCy pipeline
>>> doc = nlp(text)
```

After writing a couple of convenience functions, here are the top 5 TextRank keywords highlighted in HTML:

![zlatan](/images/zlatan.png "Swedish document parsed with top 5 keywords")

## Resources

1. [Stanza: A Python Natural Language Processing Toolkit for Many Human Languages | Papers With Code](https://paperswithcode.com/paper/stanza-a-python-natural-language-processing)
1. [You can also try out Stanza in spaCy --- Ines updated the spacy-stanfordnlp wrap... | Hacker News](https://news.ycombinator.com/item?id=22683184)
1. [Models - Stanza](https://stanfordnlp.github.io/stanza/models.html)
1. [DerwenAI/pytextrank: Python implementation of TextRank for phrase extraction and summarization of text documents](https://github.com/DerwenAI/pytextrank)
1. [Languages Supported in Amazon Comprehend - Amazon Comprehend](https://docs.aws.amazon.com/comprehend/latest/dg/supported-languages.html#supported-languages-feature)
1. [Language Support  |  Cloud Natural Language API  |  Google Cloud](https://cloud.google.com/natural-language/docs/languages#entity_analysis)
