### Known things

- The simple_web_rtc lib that is used (simplewebrtc.com) had to be modified a bit to work on the minified app. We have to check for `t.transport` before calling `t.transport.push...` every time it is called because otherwise it generates an exception that causes the app fail to start. This doesn't happen on dev mode (no concatenation/minification) or if we fetch the script from a URL using the script tag (as I think this avoids the concatenation/minification).

### Deploy to heroku instructions

Basically use this buildpack: https://github.com/AdmitHub/meteor-buildpack-horse.

1. Create the heroku app: `heroku create --stack cedar --buildpack https://github.com/AdmitHub/meteor-buildpack-horse.git`

2. Configure ROOT_URL: `heroku config:add ROOT_URL={{httpsAppURL}}`

3. Deploy: `git push heroku master`.

That's it. There seems to be a lot of meteor buildpacks for heroku, but I tried 2 before founding one that worked out of the box with Meteor 0.9.3+.