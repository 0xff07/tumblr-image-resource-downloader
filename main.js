var src = "http://fuckhardandcum.tumblr.com/archive";
var YEAR_MAX = 2016;
var YEAR_MIN = 2012;
debug = 0;

s = require('./getObjectLink.js');
t = require('./downloadObject.js');
u = require('./grepLivingObject.js');

var reg_tumblr_image=/(https?:\/\/68\.media\.tumblr\.com\/\S+_1280\.jpg)/g;
var reg_tumblr_gif = /(https?:\/\/68\.media\.tumblr\.com\/\S+_\d+\.gif)/g;
var reg_tumblr_png = /(https?:\/\/68\.media\.tumblr\.com\/\S+_1280\.png)/g;
var reg_tumblr_page = 
[ /<a target="_blank" class="hover" title.+href="(\S*)"/g,
  /<a target="_blank" class="hover" title href="(\S*)"/g ];

for(var year = YEAR_MAX; year >= YEAR_MIN; year--){
		for(var month = 12; month >= 1; month--){
		line = src + "/" + year + "/" + month;

		/* download .jpg */ 
		for(var i = 0; i < reg_tumblr_page.length; i++)
		s.getObjectLink(line, reg_tumblr_page[i], 
				function(link){
					u.grepLivingObject(link, reg_tumblr_image, debug);
				}, debug
		);

		/* download gif */
		for(var i = 0; i < reg_tumblr_page.length; i++)
		s.getObjectLink(line, reg_tumblr_page[i], 
				function(link){
					u.grepLivingObject(link, reg_tumblr_gif, debug);
				}, debug
		);

		/* download png */
		for(var i = 0; i < reg_tumblr_page.length; i++)
		s.getObjectLink(line, reg_tumblr_page[i], 
				function(link){
					u.grepLivingObject(link, reg_tumblr_png, debug);
				}, debug
		);
	}
}


/* test if getObjectLink works properly */
/*
for(var i = 0; i < reg_tumblr_page.length; i++)
	s.getObjectLink(line, reg_tumblr_page[i], null);
*/

/* single page test */
/*
page = "http://network567432.tumblr.com/post/154032477438/kimleo1982-귿밤-1130-수요일-마지막-좋다";
s.getObjectLink(page, reg_tumblr_image, 
		function(link){
			console.log(link);
		}
);
*/

/* two layer pages test */
/*
for(var i = 0; i < reg_test[i]; i++)
s.getObjectLink(line, reg_test[i], 
		function(link){
			s.getObjectLink(
				link, reg_tumblr_image, null 
			)
		}
);
*/
