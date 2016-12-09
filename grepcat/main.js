line = "http://minicooper0316.tumblr.com/archive";
YEAR_MIN = 2016;
YEAR_MAX = 2016;

debug = 0;
download = 0;


host = line.replace(/\/archive.*/, "");
dir = host.replace(/https?:\/\//, "");
fs = require('fs');
if(!fs.existsSync(dir))fs.mkdirSync(dir);
fs.writeFileSync(dir + "/" + ".page_link.txt",dir + "\n", {flag:'w+'});
fs.writeFileSync(".page_link.txt",dir +  "\n", {flag:'w+'});
fs.writeFileSync(dir + "/" + ".photo_link.txt",dir + "\n", {flag:'w+'});
fs.writeFileSync(".photo_link.txt",dir + "\n", {flag:'w+'});


var reg_tumblr_image=/(https?:\/\/68\.media\.tumblr\.com\/\S+_1280\.jpg)/g;
var reg_tumblr_img = /<img.*src="(\S+)"\s+.*/;
var reg_tumblr_image=/(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\d?\.jpg)/g;
var reg_tumblr_gif = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\.gif)/g;
var reg_tumblr_png = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d\d\d\d?\.png)/g;
var reg_tumblr_page =
[ /<a target="_blank" class="hover" title.+href="(\S*)"/g,
  /<a target="_blank" class="hover" title href="(\S*)"/g ];


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
				//console.log("Downloading " + filename + "...");
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
      if(!link.match(/.*_1280\.\S\S\S.*/g)){
        var resol = /\S+_(\d\d\d)\S+/g;
        var tmp = resol.exec(link);
        if(tmp){
          tmp = tmp[1];
          link = link.replace(tmp, "1280");
        }
      }
	  console.log(link);
	  fs.writeFileSync(dir + "/" + ".photo_link.txt",link + "\n", {flag:'a+'});
	  fs.writeFileSync(".photo_link.txt",link + "\n", {flag:'a+'});
	  if(download)
		downloadObject(link);
    }, debug);
}



function scrollDownToFindLink(URL, host, format, callback, debug){
  var request = require("request");

  /* What to do after it gets the HTML */
  function _parseLink(e, r, b){
    if(e){
      if(debug)
        console.log("fatal error\n");
      return;
    }else if(!b){
      console.log("Link not found");
    }

    var reg_next = /<a id="next_page_link" href="(\S+)">.+/g;
    if(reg_next.test(b)){
        next = b.match(reg_next);
        for(var i = 0; i < next.length; i++){
          next[0] = next[0].replace(reg_next, "$1");
          scrollDownToFindLink(host + next[0], host, format, callback, debug);
        }
    }

    var res = b.match(format);
    if(res == null){
      if(debug)
        console.log('no match found');
      return;
    }else{
      for(var i = 0; i < res.length; i++){
        res[i] = res[i].replace(format, "$1");
        callback(res[i]);
      }
    }

  }

  request.get(URL,  _parseLink);
}







/* main */
for(var year = 2016;year >= 2016; year--){
  for(var month = 11; month >= 11; month--){
    for(var i = 0; i < reg_tumblr_page.length; i++){
      src = line + "\/" + year + "\/" + month;
      scrollDownToFindLink(
        src,
        host,
        reg_tumblr_page[i],
        function(link){
			console.log(link);
			fs.writeFileSync(dir + "/" + ".page_link.txt",link + "\n", {flag:'a+'});
			fs.writeFileSync(".page_link.txt",link + "\n", {flag:'a+'});
			grepLivingObject(link, reg_tumblr_image, debug);
			grepLivingObject(link, reg_tumblr_gif, debug);
			grepLivingObject(link, reg_tumblr_png, debug);
        }, debug
      )
    }
  }
}
