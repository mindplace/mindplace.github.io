---
published: true
comments: true
title: 'Implementing Fisher-Yates shuffle algorithm in Ruby'
layout: post
---

In terms of common or standardized array shuffles, the [Fisher-Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) is king. It shuffles items in-place, rather than producing a fresh array of items, and [is unbiased](https://blog.codinghorror.com/the-danger-of-naivete/).

I believe it's also the algorithm that [Ruby uses to implement](https://ruby-doc.org/core-2.4.0/Array.html#method-i-shuffle-21) its default `array.shuffle`. And [here](https://www.frankmitchell.org/2015/01/fisher-yates/) is a great short post on writing this same algorithm in JavaScript, with lovely resources for further reading.

In terms of [Big O notation](http://blog.honeybadger.io/a-rubyist-s-guide-to-big-o-notation/), the Fisher-Yates algorithm's Big-O grade is `O(n)`, because it touches every element only once. Here's my implementation in Ruby:

<!-- gist with algorithm -->
<script src="https://gist.github.com/mindplace/3f3a08299651ebf4ab91de3d83254fbc.js"></script>

Mike Bostock [wrote an awesome, animated post](https://bost.ocks.org/mike/shuffle/) on this algorithm, showing how other implementations fall short in important but non-obvious ways. So did Jeff Atwood: Jeff showed that if you [implement this simply by counting up instead of down](https://blog.codinghorror.com/the-danger-of-naivete/), the algorithm produces dangerously biased results.

I'm not a mathematician, and my first attempt at writing a custom shuffle algorithm did work naively. By contrast, the Fisher-Yates algorithm makes much more sense, to count away from the location of the group that is becoming randomized. 
