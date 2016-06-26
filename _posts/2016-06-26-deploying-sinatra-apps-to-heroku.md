---
published: true
title: Deploying Sinatra apps to Heroku
date: 2016-06-26
---
I've deployed various Rails apps to Heroku, but never tried deploying a Sinatra app. At first glance, the process should be similar: add some gems, create new Heroku app via command line, push up, and run database setup commands. Let's see if that prediction holds true.

I've got a [StackOverflow clone](https://github.com/mindplace/throne-overthrow) that I built with a team for Dev Bootcamp that we called ThroneOverthrow (the go-to forum to ask questions about Game of Thrones!) ready to deploy. It has a lot of problems, primarily the way it looks and feels, but it's a toy app and ready enough. 

```
	$ heroku create throne-overthrow
      Creating ⬢ throne-overthrow... done
	  https://throne-overthrow.herokuapp.com/ | https://git.heroku.com/throne-overthrow.git
```

So far so good! Now to deploy...

```
	$ git push heroku master
      ... [lots of good-looking things happen on the screen...]
      Verifying deploy... done.
      To https://git.heroku.com/throne-overthrow.git
```

Sweet! Now, migrations and seeding...

```
	$ heroku run rake db:migrate
      Running rake db:migrate on ⬢ throne-overthrow... up, run.1706
      
    $ heroku run rake db:seed
	  Running rake db:seed on ⬢ throne-overthrow... up, run.8956	
```

Looks great. Opening to make sure it's up...

```
	$ heroku open
```

![throne-overthrow.png]({{site.baseurl}}/_posts/throne-overthrow.png)

It's all there! Awesome and painless.

Last step is making sure the site doesn't go to sleep when people want to check it out, which means using [Kaffeine](http://kaffeine.herokuapp.com/). Aaaand...done!
