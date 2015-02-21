#!/bin/bash
# Prerequisite https://crosswalk-project.org/documentation/downloads.html

set -e

cd ~/crosswalk-10.39.235.15
python make_apk.py --package=com.akikieng.genesis.yolobear --manifest=/home/ubuntu/yolo-bear/manifest.json

xwalkApk="/home/ubuntu/crosswalk-10.39.235.15/Yolobear_0.0.0.1_arm.apk"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/yolo-bear.keystore $xwalkApk yolo-bear
jarsigner -verify -verbose -certs $xwalkApk
rm -i ~/yolo-bear-release-signed.apk
$ANDROID_HOME/build-tools/21.1.2/zipalign -v 4 $xwalkApk ~/yolo-bear-release-signed.apk


echo "Completed build app for android"
echo "Version: "
$ANDROID_HOME/build-tools/21.1.2/aapt dump badging ~/yolo-bear-release-signed.apk |head -n 1
echo "App is now available in ~/yolo-bear-release-signed.apk"
echo "and you could upload it to Google play at https://play.google.com/apps/publish/"

