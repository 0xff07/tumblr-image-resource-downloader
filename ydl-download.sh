#! /bin/bash
	# node videoLink.js > list.txt
	# wait
	echo "sending requests..."
while read line; do
	 youtube-dl $line
done < list.txt

	wait	
	echo "ok"
