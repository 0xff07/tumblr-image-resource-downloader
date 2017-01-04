#! /bin/bash
echo "sending requests..."

read -r firstline<.vid-list.txt
echo $firstline

while read line; do
	echo $line
	youtube-dl -w $line -o $firstline/'%(title)s-%(id)s.%(ext)s'&
	for((i=0;i<9;i++));do
		read -r line
		echo $line
		youtube-dl -w $line -o $firstline/'%(title)s-%(id)s.%(ext)s'&
	done
	wait
done < .vid-list.txt

	wait	
	echo "ok"
