# Requirements
* https://github.com/peers/peerjs
* https://github.com/peers/peerjs-server

# References
* http://peerjs.com/docs/

# Server
* check https://github.com/shadiakiki1986/yolo-bear-server

# Client
* cp www/js/config-sample.js www/js/config.js
* edit www/js/config.js and set correct key, port, host, ...
* firefox www/index.html &
* or build to app using cordova wrapper whose webview supports WebRTC
  * such as crosswalk

# Mobile app
* built with crosswalk (not cordova)
  * since the default webview in android <4.4 does not support webrtc
  * this results in a 17MB apk file (vs 2MB apk file with cordova)
* check crosswalk_install.sh
