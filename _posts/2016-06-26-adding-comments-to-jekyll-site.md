---
published: true
date: 2016-06-25T00:00:00.000Z
title: Publishing comments with Disqus on a Jekyll site
layout: post
comments: true
---
Adding comments to this blog has definitely been on my to-do list for a while. It's one of the only ways that readers and users get to interact with the content I put here. I decided to use [Disqus](https://disqus.com/) comments instead of building my own solution, moreso because they support [Jekyll](https://jekyllrb.com/) sites (which is what this site is--I believe in appropriate sized containers!).

It should be simple, as their [documentation](https://help.disqus.com/customer/portal/articles/472138-jekyll-installation-instructions) is short and straightforward. First, I add a script tag to the basic layout that wraps my posts:

```
<script id="dsq-count-scr" src="//estherleytush.disqus.com/count.js" async></script>
```

Then for the pages I want to enable Disqus on, I add ```comments: true``` to the YAML front matter:

```
published: true
comments: true
```

And finally, in my posts layout, I add this to the bottom of the page:

```
<div id="disqus_thread"></div>
<script>
    (function() {
        var d = document, s = d.createElement('script');

        s.src = '//estherleytush.disqus.com/embed.js';

        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
```

Checked it out on my site and it's there and looking super spiffy! There it is below :) 
