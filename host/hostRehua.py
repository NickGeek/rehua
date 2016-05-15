#!/bin/python3
import os
import time

def getFile(path):
	with open(path) as f:
		return f.read()
contents = getFile('latest_hash.txt').split('\n')[0]
os.system('ipfs pin add -r {}'.format(contents))
os.system('ipfs name publish {}'.format(contents))

while 1:
	time.sleep(600)
	os.system('ipfs name publish {}'.format(contents))