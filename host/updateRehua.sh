#!/bin/bash
cd ..
git pull origin master
HASH=`ipfs add -r . | awk -F" " '{print $(NF-1)}'`
HASH=`echo $HASH | awk -F" " '{print $(NF)}'`
cd host
echo $HASH > latest_hash.txt

forever stopall
echo "Restart rehua with forever to update. (The command to start is 'forever start -c python3 hostRehua.py')"