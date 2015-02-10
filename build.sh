#!/bin/bash

cordova build android --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/yolo-bear.keystore ~/yolo-bear/platforms/android/ant-build/CordovaApp-release-unsigned.apk yolo-bear
jarsigner -verify -verbose -certs ~/yolo-bear/platforms/android/ant-build/CordovaApp-release-unsigned.apk
rm -i ~/yolo-bear-release-signed.apk
$ANDROID_HOME/build-tools/21.1.2/zipalign -v 4 ~/yolo-bear/platforms/android/ant-build/CordovaApp-release-unsigned.apk ~/yolo-bear-release-signed.apk

echo "Completed build app for android"
echo "App is now available in ~/yolo-bear-release-signed.apk"
echo "and you could upload it to Google play at https://play.google.com/apps/publish/"
