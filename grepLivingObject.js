function grepLivingObject(line, reg, debug){
	s = require('./getObjectLink.js');
	t = require('./downloadObject.js');
	s.getObjectLink(line, reg, t.downloadObject, debug);
}

/*
reg_tumblr_image = /http:\/\/68\.media\.tumblr\.com\/\S+_1280\.jpg/g;
var line = "http://busybeatalks.tumblr.com/post/154030300250/814stops-wish-harder-heavily-inspired-by";
grepLivingObject(line, reg_tumblr_image);
*/
exports.grepLivingObject = grepLivingObject;
