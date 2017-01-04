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

function scroll(src){
	cat(src, function(content){
		grep(content,reg_tumblr_page[0], function(link){
			console.log(link);
		fs.writeFileSync(dir + '/' + '.vid-list.txt',link + "\n", {flag:'a+'})
		fs.writeFileSync('.vid-list.txt',link + "\n", {flag:'a+'})
    });

		grep(content, reg_next, function(pfx){
			next = host + pfx;
      console.log(next);
			scroll(next);
		});
	})
}


const readline = require('readline');

const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
});




rl.question('', (line) => {
	line = line + "/filter-by/video";
	host = line.replace(/\/archive.*/, "");
	dir = host.replace(/https?:\/\//, "");
	fs = require('fs');
	if(!fs.existsSync(dir))
		fs.mkdirSync(dir)

	
	fs.writeFileSync(".vid-list.txt",dir +  "\n", {flag:'w+'});
	fs.writeFileSync(dir + "/" + ".vid-list.txt",dir + "\n", {flag:'w+'});
	scroll(line);
	rl.close();
});
