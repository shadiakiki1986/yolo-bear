#!/bin/bash
# Prerequisite, crosswalk_install.sh
# https://crosswalk-project.org/documentation/downloads.html

set -e

cd ~/crosswalk-10.39.235.15
python make_apk.py \
  --package=com.akikieng.genesis.yolobear \
  --manifest=/home/ubuntu/yolo-bear/manifest.json \
  --keystore-path=~/yolo-bear.keystore \
  --keystore-alias=yolo-bear \
  --app-version=0.0.0 \
  --arch=arm \
  --target-dir=~
$ANDROID_HOME/build-tools/21.1.2/zipalign -c -v 4 ~/Yolobear_0.0.0.1_arm.apk|tail -n 1

echo "Completed build app for android"
echo "Version: "
$ANDROID_HOME/build-tools/21.1.2/aapt dump badging ~/Yolobear_0.0.0.1_arm.apk |head -n 1
echo "App is now available in ~/Yolobear_0.0.0.1_arm.apk"
echo "and you could upload it to Google play at https://play.google.com/apps/publish/"

cd -
