var src = "http://aphephilia.tumblr.com/archive";
var YEAR_MAX = 2016;
var YEAR_MIN = 2015;
debug = 0;
download = 0;

function getObjectLink(URL, format, callback, debug){
	var request = require("request");
	var target = {
		url: URL,
		method: "GET"
	};
	function _parseLink(e, r, b){
		if(e || !b){
			if(debug)
				console.log("fatal error\n");
			return;
		}
		var res = b.match(format);
		if(res == null){
			if(debug)
				console.log('no match found');
			return;
		}
		if(callback){
			for(var i = 0; i < res.length; i++){
				res[i] = res[i].replace(format, "$1");
				callback(res[i]);
			}
		}else{
			for(var i = 0; i < res.length; i++){
				res[i] = res[i].replace(format, "$1");
				console.log(res[i]);
			}
		}
	}
	request(target,  _parseLink);
}

function downloadObject(graphurl){
	var request = require("request");
	var fs = require("fs");
	var url = require("url");
	request.get(
		{
			url:graphurl,
			encoding:"binary"
		},
		function (error, response, body){
			if(!graphurl)
				return;
			/* parsing url to get file name */
			var path = url.parse(graphurl);
			tmp = path.pathname;
			var filename = tmp.replace(/^.*[\\\/]/, '');
			if(!filename)return;

			/* check if file exists. If not, downloaf it. */
			fs.stat(filename, function(error, stat){
				if(error == null)
					return;
				fs.writeFile(
					'./' + filename,
					body, 'binary',
					function(err){
						if(err)console.log("binary writing error");
					}
				)
			})
		}
	)
}

function grepLivingObject(line, reg, debug){
  fs = require('fs');
    getObjectLink(line, reg, function(link){
      if(!link.match(/.*_1280.*/g)){
        var resol = /\S+_(\d\d\d)\S+/g;
        var tmp = resol.exec(link);
        if(tmp){
          tmp = tmp[1];
          link = link.replace(tmp, "1280");
        }
      }
    console.log(link);
    fs.writeFileSync("photo_link.txt",link + "\n", {flag:'a+'});
    if(download)
    downloadObject(link);
    }, debug);
	//getObjectLink(line, reg, downloadObject, debug);
}


var reg_tumblr_image=/(https?:\/\/68\.media\.tumblr\.com\/\S+_1280\.jpg)/g;
var reg_tumblr_gif = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d+\.gif)/g;
var reg_tumblr_png = /(https?:\/\/68\.media\.tumblr\.com\/\S+_1280\.png)/g;
var reg_tumblr_page =
[ /<a target="_blank" class="hover" title.+href="(\S*)"/g,
  /<a target="_blank" class="hover" title href="(\S*)"/g ];

for(var year = YEAR_MIN; year <= YEAR_MAX; year++){
		for(var month = 12; month >= 1; month--){
		line = src + "/" + year + "/" + month;

		/* download .jpg */
		for(var i = 0; i < reg_tumblr_page.length; i++)
		getObjectLink(line, reg_tumblr_page[i],
				function(link){
					grepLivingObject(link, reg_tumblr_image, debug);
					grepLivingObject(link, reg_tumblr_gif, debug);
					grepLivingObject(link, reg_tumblr_png, debug);
				}, debug
		);
	}
}
