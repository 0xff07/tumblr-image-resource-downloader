#! bin/bash
while read line; do
	echo $line | node grepvid.js
	wait
	sh pydl.sh
 
 done < .grep_target.txt


