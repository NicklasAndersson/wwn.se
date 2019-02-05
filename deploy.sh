#!/usr/bin/env bash
# ssh oderland 'mkdir -p /home2/nicklasa/wwn.se/images'
# scp -r images/*.png oderland:/home2/nicklasa/wwn.se/images

# ssh oderland 'mkdir -p /home2/nicklasa/wwn.se/inter-ui-3-2'
# scp -pr inter-ui-3-2/*.{woff,woff2,css} oderland:/home2/nicklasa/wwn.se/inter-ui-3-2

scp dist/*.{html,png,js} oderland:/home2/nicklasa/wwn.se


