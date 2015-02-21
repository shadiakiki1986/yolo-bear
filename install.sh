#!/bin/bash

set -e
cd ~

# Prerequisites: java -v, ant -v, python --version
sudo apt-get install curl npm openjdk-7-jdk ant gcc-multilib lib32z1 lib32stdc++6

# install node.js
curl -sL https://deb.nodesource.com/setup | bash - 
apt-get install -y nodejs

# crosswalk
wget https://download.01.org/crosswalk/releases/crosswalk/android/stable/10.39.235.15/crosswalk-10.39.235.15.zip
unzip crosswalk-10.39.235.15.zip

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

# generate keystore for signing app before upload to google play
keytool -v -genkey -v -keystore yolo-bear.keystore -alias yolo-bear -keyalg RSA -validity 10000
