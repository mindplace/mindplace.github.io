---
published: true
comments: true
title: 'AngelHack Brooklyn 2016: Using HPE''s API to build Curator'
date: 2016-06-29T00:00:00.000Z
layout: post
---
[Curator](https://github.com/mindplace/Curator-a-) won at [AngelHack Brooklyn 2016](http://angelhack.com/portfolio-item/brooklyn-usa-may-7-8-2016/) for best use of [HPE Haven OnDemand](https://dev.havenondemand.com/apis)'s API! 

![curator](/assets/blog/curator.png)

We built [Curator](https://github.com/mindplace/Curator-a-) as a Rails app. It uses the Reddit API and the NYTimes API to pull text data when queried with a search term, then makes a call to an [HPE's content-extraction API](https://dev.havenondemand.com/apis/getcontent#overview) that parses the text data. These concepts are returned to the frontend, where the jQuery library [jQCloud](https://github.com/lucaong/jQCloud) uses it to create beautiful word clouds displaying how the media vs individuals feel about the given search query. Here's some sample results when queried with 'Clinton':

![clinton-query-curator](/assets/blog/curator-clinton.png)

Let's take a look at how Curator works. Most of the work happens in our backend controller when a user triggers a search:

<script src="https://gist.github.com/mindplace/afb75737a756eb5892e900a3fc189fd8.js"></script>

Let's look at the <code>call_to_Reddit</code> more closely, one of our helper methods. It takes the search term and makes two searches with Reddit--one to /r/worldnews and one to /r/news--to come back with one post from each subreddit. We wanted to tackle both of the main news outlets on Reddit, and we needed to use Reddit's search in order to limit our data to actual relevant posts that were more likely to have a high volume of comments. 

<script src="https://gist.github.com/mindplace/0d1e29b8fd77f56e62b6ccc83af611b6.js"></script>

For each of these two posts, we parsed them to get just their URLs, then triggered a call to <code>parse_posts</code> to grab their content.

This is where the meat of the work comes in. Using Reddit again, we used the two links we got from <code>call_to_Reddit</code> to get all the content for those posts. The data comes in as a giant hash, which we needed to parse for just its text elements. The post URLs and titles are preserved in one part of our hash, while the other part contains just the comment text data.

<script src="https://gist.github.com/mindplace/67e02efee51ec7529449f9be620fdf57.js"></script>

Getting the comments was tricky, in part because it was hard to understand which parts of the incoming JSON data were actually relevant, and in part because it required a recursive approach in order to preserve comments made on comments etc. Here's what we ended up doing: 

<script src="https://gist.github.com/mindplace/31948caecce83b612739baba2786e139.js"></script>

I later extracted the comment grabbing portion of the work that we did and turned that into a Ruby gem called [reddit_comments](https://github.com/mindplace/reddit_comments_gem).

Once we had our text data, it was time to make the call to [HPE's content-extraction API](https://dev.havenondemand.com/apis/getcontent#overview). In order to do this, we decided to use the official [havenondemand](https://github.com/HPE-Haven-OnDemand/havenondemand-ruby) Ruby gem. This greatly simplified what we needed to do, making it possible to simply initialize a client and send a request. Here's our code for that:

<script src="https://gist.github.com/mindplace/a9640d6406cf3986f8cc59e18564f0aa.js"></script>

While getting the data from Reddit and NYTimes was costly in terms of how long it took, HPE had a very fast turnaround. 

```
Started GET "/search?utf8=%E2%9C%93&term=Clinton" for ::1 at 2016-06-29 17:38:43 -0400
Processing by DashboardController#search as */*
  Parameters: {"utf8"=>"✓", "term"=>"Clinton"}
Completed 200 OK in 5914ms (Views: 0.1ms | ActiveRecord: 0.0ms)
```

And that was it! After that we delivered the data in JSON format to our frontend and used the [jQCloud](https://github.com/lucaong/jQCloud) library to create word clouds with the concepts that the HPE API extracted for us. 

*I'm [Esther Leytush](https://github.com/mindplace), and my team was [Josh Wu](https://github.com/JoshJHWu), [John Seo](https://github.com/seodo), [Rebecca Kleinberg](https://github.com/RebeccaKleinberg), and [Lawson Marlowe](https://github.com/sonomar). We're all recent [Dev Bootcamp](http://devbootcamp.com/) graduates and we had a huge blast at AngelHack.*


