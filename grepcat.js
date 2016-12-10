/********** set here ********/
SET_FILT = 1;

/* regullar expressions for parsing */
var reg_tumblr_image=/(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\d?\.jpg)/g;
var reg_tumblr_gif = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\d?\.gif)/g;
var reg_tumblr_png = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\d?.png)/g;
var reg_tumblr_page =
[ /<a target="_blank" class="hover" title.+href="(\S*)"/g,
  /<a target="_blank" class="hover" title href="(\S*)"/g ];
var reg_next = /<a id="next_page_link" href="(\S+)">.+/g;

/* functions. view them as library */
function cat(URL, callback)
{
	var request = require('request')
	URL = encodeURI(URL);

	request({url:URL, method:'GET'}, function(e, r, b){
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



/*
   what scroll(url) does : 
   1. cat content of archive page
   2. grep post links(and save it to .page_link.txt)
   3. cat the content of post
   4. grep image link
   5. grep photo links and write to .photo_link.txt
   6. send request to get more content(i.e. to scroll down), and go to 1.
*/

function scroll(src){
	cat(src, function(content){
		grep(content,reg_tumblr_page[0], function(link){
			console.log(link);	
			fs.writeFileSync(".page_link.txt",encodeURI(link) +  "\n", {flag:'a+'});
			fs.writeFileSync(dir + "/" + ".page_link.txt",link + "\n", {flag:'a+'});
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
					var avatar = /.*avatar.*/g;
					if(avatar.test(link))
						return;
					console.log(link);
					fs.writeFileSync(dir + "/" + ".photo_link.txt",link + "\n", {flag:'a+'});
					fs.writeFileSync(".photo_link.txt",link + "\n", {flag:'a+'});
				})
				grep(content, reg_tumblr_png, function(link){
					if(!link.match(/.*_1280\.\S\S\S.*/g) & SET_FILT){
						var resol = /\S+_(\d\d\d)\S+/g;
						var tmp = resol.exec(link);
						if(tmp){
							tmp = tmp[1];
							link = link.replace(tmp, "1280");
						}
					}
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

const readline = require('readline');

const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
});

rl.question('', (line) => {
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
	scroll(line);
	rl.close();
});


