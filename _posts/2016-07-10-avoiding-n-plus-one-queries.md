---
published: true
comments: true
title: 'Avoiding N+1 Queries'
layout: post
---
N+1 errors are considered one of the most common reasons for slow Rails apps. I gave a talk on this issue at [Rails Camp](http://railscamp.io/), one of the [Open Camps at the UN](http://opencamps.org/) events happening in NYC during July 2016. Check out the [slides](http://www.slideshare.net/EstherLeytush/avoiding-n1-errors-in-rails-apps) on Slideshare, and the [repository](https://github.com/mindplace/n_plus_one_blog) with the sample app on Github. The code is in 2 branches: the master branch is the app without being optimized to avoid N+1 queries, while the `eager-loading` branch is optimized and meant as a contrast.

But things are more fun when they're written out, with lovely code samples! So without further ado...

<hr>

## N+1 errors in Rails apps
### What they are  

N+1 errors are when a parent record needs to load information about some child records and queries the database once per child record. So say you had an index page for posts: you'd query the database from your controller to load those posts via `@posts = Post.all` or something of the sort, and say you'd then have 20 posts for the page in total. But then if you needed to render info of an association attached to a post record--such as that post's number of comments--you'd be querying for those comments once per post. So, 1 query to get 20 posts, and then 20 queries to get the total comments per post, for a total of 21 queries: hence the name N+1.

Here's an example in action:

```ruby
# From the PostController:

def index
  @posts = Post.order(created_at: :desc).limit(10)
end
```

```html
 <!-- From the post index page view: -->

<% @posts.each do |post| %>

    <div class="col-md-8 col-md-offset-2 panel panel-default panel-body">
      <h4><%= post.body %></h4>
      <p class="date"><i>posted by <b><%= link_to post.user.username, user_path(post.user) %></b> <%= time_ago_in_words(post.created_at) %> ago</i></p>
    </div>

<% end %>
```

Notice that the view is making a call to the `post.user` association. This data isn't held on the post object itself, which is why it needs to query the database for it. Here's the resulting log when this page is requested:

```sql
Started GET "/post" for ::1 at 2016-07-19 16:48:35 -0400
Processing by PostController#index as HTML
  Post Load (12.5ms)  SELECT  "posts".* FROM "posts"  ORDER BY "posts"."created_at" DESC LIMIT 10
  User Load (0.3ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 9]]
  User Load (0.2ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 12]]
  User Load (0.3ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 2]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 9]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 2]]
  User Load (0.2ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 8]]
  User Load (0.2ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 5]]
  User Load (0.1ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 6]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 6]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 6]]
  Rendered post/index.html.erb within layouts/application (47.4ms)
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 12]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 12]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 12]]
Completed 200 OK in 85ms (Views: 59.4ms | ActiveRecord: 14.9ms)
```

This is considered an error because it's inefficient to make that many requests to a server when they could be couched as one or two requests in total. Because the above result is just awful when considering that that's just for 10 posts in total. If you had 100, 1000, or more items to get info about, your app would  be in trouble. The page load times would certainly suffer.

### How to fix them

Eager loading is one of the solutions for this problem. That's something that Rails now comes built-in with, and there's three main methods related to preloading the associations you'll need: `preload`, `includes`, and `eager_load`:

```
preload
Preload is default case for #includes method – it creates two separate queries, one for main query and other for associated data. ...

includes
Instead of #preload, #includes chooses to make one query based on situation – if you add associated #where clause. This will make more complex SQL query. ...

eager_load
This method is the same as combination of #includes and #references as it makes one query with LEFT OUTER JOIN.
```
*From ["Remove N+1 queries in your Ruby on Rails app"](http://blog.diatomenterprises.com/remove-n1-queries-in-your-ruby-on-rails-app/).*

Here's preloading the user association for posts from our previous example, using `preload`:

```ruby
# From the PostController

def index
    @posts = Post.preload(:user).order(created_at: :desc).limit(10)
end
```

And the resulting queries:

```SQL
Started GET "/post" for ::1 at 2016-07-19 16:55:38 -0400
Processing by PostController#index as HTML
  Post Load (0.4ms)  SELECT  "posts".* FROM "posts"  ORDER BY "posts"."created_at" DESC LIMIT 10
  User Load (12.4ms)  SELECT "users".* FROM "users" WHERE "users"."id" IN (9, 12, 2, 8, 5, 6)
  Rendered post/index.html.erb within layouts/application (33.0ms)
  User Load (0.2ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 12]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 12]]
  CACHE (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = $1 LIMIT 1  [["id", 12]]
Completed 200 OK in 62ms (Views: 44.2ms | ActiveRecord: 15.6ms)
```

So much better!

<hr>

## Resources and references
The [slides](http://www.slideshare.net/EstherLeytush/avoiding-n1-errors-in-rails-apps) from the talk  
The [sample app](https://github.com/mindplace/n_plus_one_blog) built to support the talk  
[Bullet gem](https://github.com/flyerhzm/bullet)  
["The (Silver) Bullet for the N+1 Problem"](https://www.sitepoint.com/silver-bullet-n1-problem/)  
["Remove N+1 queries in your Ruby on Rails app"](http://blog.diatomenterprises.com/remove-n1-queries-in-your-ruby-on-rails-app/)  
["Buggy Rails Code: The 10 Most Common Mistakes That Rails Developers Make"](https://www.toptal.com/ruby-on-rails/top-10-mistakes-that-rails-programmers-make)  
["Avoid the N+1 problem in in Rails by harnessing your database"](http://aspiringwebdev.com/avoid-the-n1-problem-in-rails-by-harnessing-your-database/)  
["3 ways to do eager loading (preloading) in Rails 3 & 4"](http://blog.arkency.com/2013/12/rails4-preloading/)  
["How to preload Rails scopes"](http://www.justinweiss.com/articles/how-to-preload-rails-scopes/)  
["RailsCasts #22, Eager Loading"](http://railscasts.com/episodes/22-eager-loading)  
["ActiveRecord, Eager Loading Associations"](http://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations)  
["The Vital Guide to Ruby on Rails Interviewing"](https://www.toptal.com/ruby-on-rails#nPlus1Queries)  
