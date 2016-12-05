
function parseArchive(URL, format, callback){

var request = require("request");
//var cheerio = require("cheerio");
//var html = require("html");

var target = {
	url: URL,
	method: "GET"
};



function _parseLink(e, r, b){
	if(e){
		console.log("fatal error\n");
		return;
	}
	var res = format.match(b);
	if(callback){
		for(var i = 0; i < res.length; i++)
			callback(res[i]);
	}else{
		for(var i = 0; i < res.length; i++)
			console.log(res[i]);
	}
}

request(target,  _parseLink);
}

var source = "http://goding5156.tumblr.com/archive/2016/12";
var reg_tumblr_page = [/.*\/post\/\d*$/, /.*\/post\/\d*\/.+/];


exports.parseArchive = parseArchive;
