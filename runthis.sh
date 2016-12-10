#! bin/bash
while read line; do
	echo $line | node grepcat.js
	wait
	sh pgdl.sh
	#sh pydl.sh
 
 done < .grep_target.txt


