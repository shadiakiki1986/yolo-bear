#!/bin/bash
# Run the following to prepare for building the mobile app
# sudo su
# curl -sL https://raw.githubusercontent.com/shadiakiki1986/yolo-bear/master/prebuild.sh | bash -
#
# Notes:
# 1. This isn't functional yet I think
# 2. Update the android sdk version number later
# 3. Manually update which SDK API versions to download for android update sdk command

set -e

# install prerequisites, except node.js
sudo apt-get install curl npm openjdk-7-jdk ant gcc-multilib lib32z1 lib32stdc++6

# install node.js
curl -sL https://deb.nodesource.com/setup | bash - 
apt-get install -y nodejs

# install cordova
npm install -g cordova

# install android sdk
# Reference: http://sblackwell.com/blog/2014/06/installing-the-android-sdk-on-a-headless-server/
wget http://dl.google.com/android/android-sdk_r24.0.2-linux.tgz
tar -xzf android-sdk_r24.0.2-linux.tgz
echo "export ANDROID_HOME=/home/ubuntu/android-sdk-linux" >> ~/.bash_profile
echo "export PATH=\$PATH:\$ANDROID_HOME/tools" >> ~/.bash_profile
echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.bash_profile
source ~/.bash_profile
android list sdk # install api in android sdk
android update sdk --no-ui --filter 1,2,4

# download app
sudo apt-get install git
git clone https://github.com/shadiakiki1986/yolo-bear.git

# prepare for build for android
cd yolo-bear
cordova platform add android

# generate key for this app for google play
keytool -v -genkey -v -keystore yolo-bear.keystore -alias yolo-bear -keyalg RSA -validity 10000
