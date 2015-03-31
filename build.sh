#!/bin/bash
# Prerequisite, crosswalk_install.sh
# https://crosswalk-project.org/documentation/downloads.html

set -e

version=0.0.2
versionCode=3
output=~/Yolobear_${version}_arm.apk

rm -f $output
python ~/crosswalk-10.39.235.15/make_apk.py \
  --package=com.akikieng.genesis.yolobear \
  --manifest=/home/ubuntu/yolo-bear/manifest.json \
  --keystore-path=~/yolo-bear.keystore \
  --keystore-alias=yolo-bear \
  --app-version=${version} \
  --app-versionCode=${versionCode} \
  --arch=arm \
  --target-dir=~ \
  --verbose
$ANDROID_HOME/build-tools/21.1.2/zipalign -c -v 4 $output|tail -n 1

echo "Completed build app for android"
echo "Version: "
$ANDROID_HOME/build-tools/21.1.2/aapt dump badging $output |head -n 1
echo "App is now available in $output"
echo "and you could upload it to Google play at https://play.google.com/apps/publish/"
