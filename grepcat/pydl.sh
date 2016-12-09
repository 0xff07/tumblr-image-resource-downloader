#! /bin/bash
echo "sending requests..."

read -r firstline<.page_link.txt
echo $firstline

while read line; do
	echo line >> Done.txt
	echo "\n" >> Done.txt
	youtube-dl -w $line -o $firstline/'%(url)s.%(ext)s' &
	for((i=0;i<4;i++));do
		read -r line
		echo line >> Done.txt
		echo "\n" >> Done.txt
		youtube-dl -w $line -o $firstline/'%(url)s.%(ext)s' &
	done
	wait
done < .page_link.txt

	wait	
	echo "ok"
