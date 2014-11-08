### Known things

- The simple_web_rtc lib that is used (simplewebrtc.com) had to be modified a bit to work on the minified app. We have to check for `t.transport` before calling `t.transport.push...` every time it is called because otherwise it generates an exception that causes the app fail to start. This doesn't happen on dev mode (no concatenation/minification) or if we fetch the script from a URL using the script tag (as I think this avoids the concatenation/minification).

- Users' _id was being set as a float number by our code (without a good reason), and (somehow, I don't know why), that was messing with Meteor reconnections with an error that said: `Server sent add for existing id: ` with the id of the current user. Letting meteor handle the _id (it sets it as a string, I don't know if there is anything different), seems to let Meteor reconnections work fine. This error seemed to be somewhat related with the snapshots too. If I left the float _ids but I prevented the Users objects from having snapshots, it all worked. So it might be something with a race condition between `Meteor.disconnect()` and `Meteor.reconnect()` that takes more time if the object is big and if the id is not a string. But I don't really know.

### Deploy to heroku instructions

Basically use this buildpack: https://github.com/AdmitHub/meteor-buildpack-horse.

1. Create the heroku app: `heroku create --stack cedar --buildpack https://github.com/AdmitHub/meteor-buildpack-horse.git`

2. Configure ROOT_URL: `heroku config:add ROOT_URL={{httpsAppURL}}`

3. Deploy: `git push heroku master`.

That's it. There seems to be a lot of meteor buildpacks for heroku, but I tried 2 before founding one that worked out of the box with Meteor 0.9.3+.