#!/bin/python3
import os
import time

os.system('killall ipfs')
os.system('ipfs daemon')

while 1:
	time.sleep(1800)
	os.system('killall ipfs')
	os.system('ipfs daemon')