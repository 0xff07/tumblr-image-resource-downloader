#! /bin/bash
echo "sending requests..."

uniq -u .page_link.tmp > .page_link.txt
rm .page_link.tmp

wait

read -r firstline<.page_link.txt
echo $firstline

while read line; do
	youtube-dl -w $line -o $firstline/'%(url)s.%(ext)s' &
	for((i=0;i<9;i++));do
		read -r line
		youtube-dl -w $line -o $firstline/'%(url)s.%(ext)s' &
	done
	wait
done < .page_link.txt

	wait	
	echo "ok"
