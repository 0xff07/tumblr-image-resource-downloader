var request = require("request");
var fs = require("fs");
var html = require("html");

var URL = "http://killerhan.tumblr.com/archive/2016/11";
request.get(
		"http://killerhan.tumblr.com/archive/2016/11?before_time=1477466751",
		function(e, r, b){
			console.log(b);
		}		
)


function getHTML(URL)
{

	var request = require("request");
	var fs = require("fs");
	var html = require("html");

	var target = {
		url: URL,
		method: "GET"
	};

	function _getSourceCode(e, r, b)
	{
		if(e){
			console.log("Problem occur in getSourceCode() at : ");
			console.log(URL);
			return;
		}
		var source = html.prettyPrint(b, {indent_size:2});

		var d = new Date();
		var re = /<title>(.*)<\/title>/g;
		var title = source.match(re);
		if(title)
			title = title[0].replace(re, "$1");
		else
			title = d.getTime();

		fs.writeFileSync(title + ".html" , source);
	}
	request(target, _getSourceCode);
}




exports.getHTML = getHTML;
