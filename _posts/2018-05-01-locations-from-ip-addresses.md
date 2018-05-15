---
published: false
comments: true
title: 'Locations from IP Addresses'
layout: post
---

Remote IP on Heroku
https://gist.github.com/johnrees/1670449

Getting client IP in Rails 
https://stackoverflow.com/questions/4465476/rails-get-client-ip-address

HTTP Routing
https://devcenter.heroku.com/articles/http-routing

Why can't i access x-forwarded-for in my java spring app
https://help.heroku.com/FIX647OC/why-can-t-i-access-the-x-forwarded-for-header-in-my-java-spring-app

`request.remote_ip` returns wrong item
https://github.com/rails/rails/issues/7979

ipstack.com
https://ipstack.com/documentation

test with api.ipstack.com/{ ip address }?access_key={ access token }

response
```json
{"ip":"72.69.164.150","type":"ipv4","continent_code":"NA","continent_name":"North America","country_code":"US","country_name":"United States","region_code":"NY","region_name":"New York","city":"Brooklyn","zip":"11224","latitude":40.5767,"longitude":-73.99,"location":{"geoname_id":5110302,"capital":"Washington D.C.","languages":[{"code":"en","name":"English","native":"English"}],"country_flag":"http:\/\/assets.ipstack.com\/flags\/us.svg","country_flag_emoji":"\ud83c\uddfa\ud83c\uddf8","country_flag_emoji_unicode":"U+1F1FA U+1F1F8","calling_code":"1","is_eu":false}}
```

```ruby
def set_viewer_ip_address
  @viewer_ip_address = request.env["HTTP_X_FORWARDED_FOR"].try(:split, ',').try(:last) || request.remote_ip
end

def location_from_ip_address # using IPStack service
  set_viewer_ip_address

  uri = URI.parse("http://api.ipstack.com/#{viewer_ip_address}")
  uri.query = URI.encode_www_form({ access_key: ENV["IPSTACK_KEY"] })
  http = Net::HTTP.new(uri.host, uri.port)

  begin
    location_request = Net::HTTP::Get.new(uri.request_uri)
    location_response = http.request(location_request)
    JSON.parse(location_response.body)
  rescue => e
    logger.error e
    default_location
  end
end
```
