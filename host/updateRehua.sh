#!/bin/bash
cd ..
git pull origin master
HASH=`ipfs add -r . | awk -F" " '{print $(NF-1)}'`
HASH=`echo $HASH | awk -F" " '{print $(NF)}'`
cd host
echo $HASH > latest_hash.txt

forever stopall
forever start -c python3 hostRehua.py
forever start -c python3 refreshDaemon.py
forever list