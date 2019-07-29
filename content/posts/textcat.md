---
title: "Real world text classification, ... I guess"
date: 2019-07-29
categories:
  - Applied NLP
---

## Business problem

I work on a football news corpus and I'll looking to automate a process that consists of "tagging" an article with the "entities" the article is about (eg: football clubs, competitions and players).

In NLP terms, we're trying to perform **multilabel text classification**, but with a lot of potential classes (think 2k).

In the last 5 months, I've been working on solving that problem by, researching the state of the art, trying to leverage existing models and services as much as possible, and build and deploying a custom model when that was needed.

## Research

In my experience, Text categorisation is a well understood task in academia by now. Datasets like [AG news](https://paperswithcode.com/sota/text-classification-on-ag-news) or [DBPedia](https://paperswithcode.com/sota/text-classification-on-dbpedia) or [Jigsaw Toxic Comments](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge) are helpful benchmarks, and there are also a [few other datasets](https://paperswithcode.com/task/text-classification) I don't have particular experience with.

But academia and real life are different, and I am doing **applied** NLP, so what is the issue? The issue with text categorisation problems I've encountered at work lies in **the number of classes**. Basically, training a custom textcat model for 10 or 100 classes is OK, but when dealing with 1,000 or 10,000 classes, things get messy.

> # The issue with text categorisation lies in the number of classes

Hereafter I will write short notes on where my research in the last 6 months has led me.

### End to end bidirectional LSTM using GloVe embeddings

I first trained a simple deep learning architecture I wrote in keras on the Jigsaw Toxic Comment classification dataset.

I quickly realised that the dataset size will be an issue. With jigsaw, there are 6 classes and 144k training samples. My architecture had 500k parameters. Going from 6 classes to 2k with the same architecture (only the last layer because bigger now) multiplies the number of parameters for the model by a factor 2.

Assuming that you want to keep the same ratio for training samples / number of parameters, that's roughly 2\*144k=288k training samples, in other words **14.4 times more data than I have**.

| Name                  | Number of training examples | Number of words in total | Number of classes |
| --------------------- | --------------------------- | ------------------------ | ----------------- |
| Jigsaw Toxic Comments | 144k                        |                          | 6                 |
| _My dataset_          | _20k_                       | _151k_                   | _2.5k_            |

### TagSpace (2014) and StarSpace (2017) by Facebook

StarSpace is a general embedding model that improves over fastText (which was an improvement over word2vec). It establishes good baselines for different NLP tasks that are relevant to a lot of applied NLP practitioners. Among those, it performs 2 tasks that I'm interested in :

- learning words embeddings
- multilabel text classification with up to 100k possible classes (hereafter `textcat`)

> The embeddings of words comprising a text are combined using a model-dependent function producing a point in the same embedding space. A similarity measure (cosine or inner product) gauges the pairwise relevance of points in the embedding space.

In other words, the textcat problem is used as a supervision signal to train the word embeddings, and the classes' embeddings lie in the same space than the words, thus becoming comparable.

This textcat task attempts to rank a document's ground-truth categories higher than categories it does not contain:

> We first sum the embeddings of each word in the text, and then rank categories by similarity of their embedding to that of the text

One major caveat is that **those models seem to require lots of data**.
Here are the datasets mentioned in the paper compared to my own dataset:

| Name                | Number of training examples | Number of words in total | Number of classes |
| ------------------- | --------------------------- | ------------------------ | ----------------- |
| AG news             | 120k                        | 100k                     | 4                 |
| DBpedia             | 560k                        | 800k                     | 14                |
| Pages for TagSpace  | 35.3M (millions)            | 1.6B (billions)          | 100k ?            |
| People for TagSpace | 201M                        | 5.5B                     | 100k ?            |
| _My dataset_        | _20k_                       | _151k_                   | _2.5k_            |

### BlazingText by AWS

BlazingText is AWS's version of word2vec. You can also learn embeddings and train a texcat task. Finally, you can used pre-trained fastText embedddings. [Link](https://docs.aws.amazon.com/sagemaker/latest/dg/blazingtext.html)

I've trained a model on DBPedia using SageMaker. You can expose both the textcat model and the similarity from the embeddings.

### Framing the problem as Entity Linking

Pretty early on, I've thought of using Named Entity Recognition to extract entity mentions from text spans in the documents, and then compare that to surface forms dictionnaries to get the entities mentioned. Add to this a pruning step with some frequency rules, and you have a "tagging" system.

We would run into issues with Polysemy (Red Devils is both a club from EPL or a European national team) and Vagueness (eg: "his club" when talking about a player).

After some research (I had found the [Entity Oriented Search](https://eos-book.org/) book by then) and some discussions with peers (special thanks to some Parisian dudes working with videos 😉), I landed on the idea that in a setup like this with a lot of classes and a small dataset, framing the problem as [Entity Linking](https://en.wikipedia.org/wiki/Entity_linking) would help.

I set out to build an Entity Linking pipeline against our domain databases. I used in spacy and pandas, implementing everything needed along the way (eg: the data pipeline, the TAGME algo, the backend endpoints ...).

Around the same time (Feb 2019) the guys over at spacy were thinking about supporting EL in spacy. They opened an [issue](https://github.com/explosion/spaCy/issues/3339) and 5 months later (July 2019) they merged a [PR](https://github.com/explosion/spaCy/pull/3864) implementing EL against WikiData.

## Conclusions

Given the small dataset and the number of classes, I still think framing the problem as Entity Linking was the right call. My deep learning experiments and my discussions with various researchers confirmed me in that direction.

In the future I will keep StarSpace in mind for other business problems (like recommendations or knowledge graph embedding). I will also look deeper into spacy's Entity Linking against Wikipedia and Wikidata.

This was sort of a day in the life of a Data Scientist trying to work on applied NLP. The journey can be bumpy and feel pretty lonely when you have to make big calls on architecture design and problem framing. So please feel free to send me your feedback as this is probably my best shot at learning and go forward.
