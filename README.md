### Deploy to heroku instructions

Basically use this buildpack: https://github.com/AdmitHub/meteor-buildpack-horse.

1. Create the heroku app: `heroku create --stack cedar --buildpack https://github.com/AdmitHub/meteor-buildpack-horse.git`

2. Configure ROOT_URL: `heroku config:add ROOT_URL={{httpsAppURL}}`

3. Deploy: `git push heroku master`.

That's it. There seems to be a lot of meteor buildpacks for heroku, but I tried 2 before founding one that worked out of the box with Meteor 0.9.3+.
