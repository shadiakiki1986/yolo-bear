#!/bin/bash
# Prerequisite https://crosswalk-project.org/documentation/downloads.html

cd ~/crosswalk-10.39.235.15
python make_apk.py --package=com.akikieng.genesis.yolobear --manifest=/home/ubuntu/yolo-bear/manifest.json
