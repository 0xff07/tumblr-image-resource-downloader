#! /bin/bash

echo "sending requests..."

while read line; do
	youtube-dl -w $line
done < .page_link.txt

	wait	
	echo "ok"
