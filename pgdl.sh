#! /bin/bash
uniq -u .photo_link.tmp > .photo_link.txt
rm .photo_link.tmp
read -r firstline<.photo_link.txt
echo $firstline

while read line; do
	wget -nc -P $firstline/ $line &
	for((i=0;i<19;i++));do
		read -r line
		wget -nc -P $firstline/ $line &
	done
	wait
done < .photo_link.txt
	wait
	echo "ok"	
