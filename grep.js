
/********** set here ********/
var line = "http://minicooper0316.tumblr.com/archive";
SET_FILT = 1;


/* regullar expressions for parsing */
var reg_tumblr_image=/(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\d?\.jpg)/g;
var reg_tumblr_gif = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\.gif)/g;
var reg_tumblr_png = /(https?:\/\/68\.media\.tumblr\.com\/\S+_1280.png)/g;

var reget = 
[   reg_tumblr_image, 
	reg_tumblr_gif, 
	reg_tumblr_png	];

var reg_tumblr_page =
[ /<a target="_blank" class="hover" title.+href="(\S*)"/g,
  /<a target="_blank" class="hover" title href="(\S*)"/g ];

var reg_next = /<a id="next_page_link" href="(\S+)">.+/g;



/* functions. view them as library */
function cat(URL, callback)
{
	var request = require('request')
	request.get(URL, function(e, r, b){
		if(callback)
			callback(b);
	})
}


function grep(source, format, callback){
	if(!source){
		return;
	}
	res = source.match(format);
	if(res == null){
		return -1;
	}
	for(var i = 0; i < res.length; i++){
		res[i] = res[i].replace(format, "$1");
		if(callback)callback(res[i]);
	}
}



/* main */

/* create folder for images and videos */
host = line.replace(/\/archive.*/, "");

dir = host.replace(/https?:\/\//, "");
console.log(dir);
fs = require('fs');
if(!fs.existsSync(dir))
	fs.mkdirSync(dir)
	
fs.writeFileSync(dir + "/" + ".page_link.txt",dir + "\n", {flag:'w+'});
fs.writeFileSync(".page_link.txt",dir +  "\n", {flag:'w+'});
fs.writeFileSync(dir + "/" + ".photo_link.txt",dir + "\n", {flag:'w+'});
fs.writeFileSync(".photo_link.txt",dir + "\n", {flag:'w+'});


/*
   what scroll(url) does : 
   1. cat content of archive page
   2. grep post links(and save it to .page_link.txt)
   3. cat the content of post
   4. grep image link
   5. print the link(you can write or redirect to other file.)
   6. send request to get more content(i.e. to scroll down), and go to 1.
*/

function scroll(src){
	cat(src, function(content){
		grep(content,reg_tumblr_page[0], function(link){
			console.log(link);	
			fs.writeFileSync(".page_link.txt",link +  "\n", {flag:'a+'});
			fs.writeFileSync(dir + "/" + ".page_link.txt",link + "\n", {flag:'a+'});
			link = encodeURI(link);
			cat(link, function(content){
				grep(content, reg_tumblr_image, function(link){
					if(!link.match(/.*_1280\.\S\S\S.*/g) & SET_FILT){
						var resol = /\S+_(\d\d\d)\S+/g;
						var tmp = resol.exec(link);
						if(tmp){
							tmp = tmp[1];
							link = link.replace(tmp, "1280");
						}
					}
					fs.writeFileSync(dir + "/" + ".photo_link.txt",link + "\n", {flag:'a+'});
					fs.writeFileSync(".photo_link.txt",link + "\n", {flag:'a+'});

				})
				grep(content, reg_tumblr_gif, function(link){
					console.log(link);
					fs.writeFileSync(dir + "/" + ".photo_link.txt",link + "\n", {flag:'a+'});
					fs.writeFileSync(".photo_link.txt",link + "\n", {flag:'a+'});
				})
				grep(content, reg_tumblr_png, function(link){
					var avatar = /.*avatar.*/g;
					if(avatar.test(link))
						return;
					console.log(link);
					fs.writeFileSync(dir + "/" + ".photo_link.txt",link + "\n", {flag:'a+'});
					fs.writeFileSync(".photo_link.txt",link + "\n", {flag:'a+'});
				})
			})
		})
		grep(content, reg_next, function(pfx){
			next = host + pfx;
			scroll(next);
		})
	})
}

/* the only code that will be executed for parsing is this */
scroll(line);


/* fun fact */
//src = "http://tjdvlf3820.tumblr.com/post/154211623748/1234567890-111-자-방금-들어온-따듯한-제보입니다-행님들-나이미상"
//cat("src", console.log) 會出現error page
//cat(encodeURI(src), console.log);
