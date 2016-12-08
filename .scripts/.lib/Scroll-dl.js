line = "http://killerhan.tumblr.com/archive";

YEAR_MIN = 2016;
YEAR_MAX = 2016;

debug = 0;
u = require('./grepLivingObject.js');

var reg_tumblr_image=/(https?:\/\/68\.media\.tumblr\.com\/\S+_1280\.jpg)/g;
var reg_tumblr_gif = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d+\.gif)/g;
var reg_tumblr_png = /(https?:\/\/68\.media\.tumblr\.com\/\S+_1280\.png)/g;
var reg_tumblr_page =
[ /<a target="_blank" class="hover" title.+href="(\S*)"/g,
  /<a target="_blank" class="hover" title href="(\S*)"/g ];



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
          console.log(host + next[0]);
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

    /* Keep scrolling down */
  }

  request.get(URL,  _parseLink);
}







/* main */

host = line.replace(/\/archive/, "");
for(var i = 0; i < reg_tumblr_page.length; i++){
  scrollDownToFindLink(
    line,
    host,
    reg_tumblr_page[i],
    function(link){
      u.grepLivingObject(link, reg_tumblr_image, debug);
      u.grepLivingObject(link, reg_tumblr_gif, debug);
      u.grepLivingObject(link, reg_tumblr_png, debug);
    }, debug)
}
