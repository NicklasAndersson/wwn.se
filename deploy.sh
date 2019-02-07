#!/usr/bin/env bash

yarn webpack
ssh oderland 'rm /home2/nicklasa/wwn.se/*.png'
ssh oderland 'rm /home2/nicklasa/wwn.se/*.js'
ssh oderland 'rm /home2/nicklasa/wwn.se/*.html'
scp dist/*.{html,png,js} oderland:/home2/nicklasa/wwn.se


