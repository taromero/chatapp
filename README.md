### Known things

- The simple_web_rtc lib that is used (simplewebrtc.com) had to be modified a bit to work on the minified app. We have to check for `t.transport` before calling `t.transport.push...` every time it is called because otherwise it generates an exception that causes the app fail to start. This doesn't happen on dev mode (no concatenation/minification) or if we fetch the script from a URL using the script tag (as I think this avoids the concatenation/minification).

- If the user snapshot is updated calling directly `Users.update` from the client, it generates errors on Meteor reconnection (which prevents a successful reconnection). I don't know why, but calling the update on the server (through a Meteor Method) fixed the problem. I think the problem is related with updating the user while the client is disconnected. But if I manually update a message while we are disconnected this doesn't happen. Maybe the timing makes the user update the snapshot locally, send the update to the server, but before the server responds, the connection is lost, and on reconnection there are issues.

### Deploy to heroku instructions

Basically use this buildpack: https://github.com/AdmitHub/meteor-buildpack-horse.

1. Create the heroku app: `heroku create --stack cedar --buildpack https://github.com/AdmitHub/meteor-buildpack-horse.git`

2. Configure ROOT_URL: `heroku config:add ROOT_URL={{httpsAppURL}}`

3. Deploy: `git push heroku master`.

That's it. There seems to be a lot of meteor buildpacks for heroku, but I tried 2 before founding one that worked out of the box with Meteor 0.9.3+.