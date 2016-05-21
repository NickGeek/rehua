#!/bin/bash
cd ..
git pull origin master
HASH=`ipfs add -r . | awk -F" " '{print $(NF-1)}'`
HASH=`echo $HASH | awk -F" " '{print $(NF)}'`
cd host
echo $HASH > latest_hash.txt

echo "Done! Run hostRehua.py to make sure it stays online."