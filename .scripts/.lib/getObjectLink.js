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

exports.getObjectLink = getObjectLink;
