#!/bin/bash
# Prerequisites: java -v, ant -v, python --version

cd ~/Downloads
wget https://download.01.org/crosswalk/releases/crosswalk/android/stable/10.39.235.15/crosswalk-10.39.235.15.zip

# generate keystore for signing app before upload to google play
keytool -v -genkey -v -keystore yolo-bear.keystore -alias yolo-bear -keyalg RSA -validity 10000
