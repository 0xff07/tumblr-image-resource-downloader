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
				console.log("Downloading " + filename + "...");
				d = new Date();
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
exports.downloadObject = downloadObject;
