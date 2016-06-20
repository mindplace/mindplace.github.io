---
published: false
---
## reddit_comments: my first gem!

I've wanted to build a gem since I first heard about them, but didn't find myself building any particular features or products that could be modularized and shared with others in this way. But this weekend, at AngelHack Brooklyn 2016, my team and I built [Curator](https://github.com/mindplace/Curator-a-):

> "Curator uses the Reddit API and the NYTimes API to pull text data when queried with a search term. It uses this data to make a call to the HPE Haven OnDemand API, which parses and extracts concepts. These concepts are returned to the frontend, where the jQuery library jQCloud uses it to create beautiful word clouds displaying how the media vs individuals feel about the given search query."

One of the major problems we needed to solve was grabbing text from a Reddit post page with comments. Reddit's commenting system is such that a user can make a comment on another comment, as well as on a post. So after battling http calls issues and figuring all that out, we were still left with a huge hash of comments with nested comments with nested comments. 

If you know me at all, you know that my ears perk up at these kinds of problems right away, because I am a bit of a fan of recursion. So I ended up spending a lot of time figuring out what data is given in this hash, and then designing a method to pull in those comments recursively:

```ruby
def self.recursive_comment_digging(child, comments=[])
    post = {}
    post["id"] = child["id"]
    post["parent_id"] = child["parent_id"]
    post["author"] = child["author"]
    post["body"] = child["body"]

    comments << post

    if child["replies"] != nil && child["replies"] != ""
      child["replies"]["data"]["children"].each do |comment|
        comments << self.recursive_comment_digging(comment["data"])
      end
    end
    comments
  end

```

Today I sat down and packaged up that functionality as a gem. It turned out to be a lot easier than I initially thought it would be. Essentially there were several parts to the job:

1. Deciding on scope: I decided that I wanted my gem to take a URL and return the comments posted on that Reddit page as an array of hashes.
2. Understanding what goes into building a gem: I found [RailsCast's post](http://railscasts.com/episodes/245-new-gem-with-bundler) on building a gem with Bundler to be really helpful, as well as the official [RubyGems](http://guides.rubygems.org/rubygems-basics/) documentation. 

The biggest issue I faced was when I tried to push the gem to RubyGems.org. It turned out that because my terminal had been in the folder when I had built the gem initially to install and test locally, the compiled gem file ended up being inside the folders that contained the files to build it--but resolving this was as easy as deleting that file and building it outside of the folders entirely. 

Next step is refactoring and building some RSpec tests for this gem!





