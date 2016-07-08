---
published: true
comments: true
title: Bitly clone API in Rails
layout: post
date: 2016-07-07
---


I built a nifty little [Bitly](bitly.com) clone in Rails to practice building an API backend. (The repo is here: [Bitly clone code](https://github.com/mindplace/bitly_clone)). It was similar to what my team built for [Curator](https://github.com/mindplace/Curator) and it was nice to find reaffirmation in how straightforward it is to create this kind of web structure in Rails. Let's jump into the code.

The program flow is straightfoward. There's only three routes:

```ruby
# config/routes

Rails.application.routes.draw do
  get '/shorten', to: "url#create",   as: "create_short_link"
  get '/data',    to: "url#index",    as: "get_click_data"
  get '/:short',  to: "url#show",     as: "redirect_link"
end
```

To start with the first route. In order to use this API, the user needs to make a request with params. Here's how my runner/test code looks for that:

```ruby
# runner file

def shorten_link(url)
  uri = URI.parse("http://localhost:3000/shorten")
  params = {"url": url}
  uri.query = URI.encode_www_form(params)
  JSON.parse(Net::HTTP.get(uri))
end
```

So this sample link
```
https://coderwall.com/p/uh8kiw/pass-arrays-objects-via-querystring-the-rack-rails-way
```
looks like this when sent to my API:
```
http://localhost:3000/shorten?url=https%3A%2F%2Fcoderwall.com%2Fp%2Fuh8kiw%2Fpass-arrays-objects-via-querystring-the-rack-rails-way
```

When the request hits the `/shorten` route, it triggers the `create` action:

```ruby
# UrlController

def create
  render json: shorten_multiple_links
end
```

The method `shorten_multiple_links` is found in a module `URLActions`. This method first looks to see whether the request params contain only one link, or an array of links:

```ruby
# URLActions module

def shorten_multiple_links
  if params["urls"]
	json = {"urls": []}
	params["urls"].each{ |set| json[:urls] << shorten_single_link(set["url"]) }
	json
  else
	shorten_single_link(params["url"])
  end
end
```
This helps it construct a hash of multiple links or just a single link. Let's look at what happens when passed that sample link. The method `shorten_single_link` gets called with the single link as the param:

```ruby
# URLActions module

def shorten_single_link(link)
  url = Url.find_by(body: link)
  if url
	json = {"success": true, "url": link, "short": "#{ENV["host"]}#{url.short}"}
  else
	url = Url.new(body: link)

    if url.save
	  json = {"success": true, "url": link, "short": "#{ENV["host"]}#{url.short}"}
	else
	  json = {"success": false, "url": link, "errors": url.errors_as_string}
	end
  end

  json
end
```

It tries to find that link in my database. Let's assume it's not there--that means it needs to create a new entry, which it does by generating a new URL object. On save, the model generates a short link using the callback `before_create :generate_short, if: :no_short_exists?`:

```ruby
# URL model

private

def no_short_exists?
  self.short.nil?
end

def generate_short
  self.short = SecureRandom.hex(3)

  while Url.exists?(short: self.short)
	self.short = SecureRandom.hex(3)
  end
end
```

Then, assuming all went well and it was a legitimate initial link, the `json` value is returned back to the client. Here's what that looks like:

```
{"success"=>true,
 "url"=>"https://coderwall.com/p/uh8kiw/pass-arrays-objects-via-querystring-the-rack-rails-way",
 "short"=>"http://localhost:3000/b2f6a8"}
```

Straightforward! Additionally, when using that short link, the controller simply routes the request that way:

```ruby
# UrlController

def show
  short = params[:short]
  url = Url.find_by(short: short)

  if url
	url.click_count += 1
	url.save

    redirect_to url.body
  else
	@short = "#{ENV["host"]}#{short}"
	render "/not_found"
  end
end
```

Notice the `click_count` goes up by 1. We can query for the `click_count` for that link in a nice way:

```
{"success"=>true,
 "url"=>"https://coderwall.com/p/uh8kiw/pass-arrays-objects-via-querystring-the-rack-rails-waye",
 "click_count"=>11}
```

Meaning, that url's short link has been used 11 times. Nifty!
