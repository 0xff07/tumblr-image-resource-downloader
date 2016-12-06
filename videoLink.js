src = "http://killerhan.tumblr.com/archive";
YEAR_MAX = 2016;
YEAR_MIN = 2016;
debug = 0;

s = require('./getObjectLink.js');
format =[ 
	/<a target="_blank" class="hover" title.+href="(\S*)"/g,
	/<a target="_blank" class="hover" title href="(\S*)"/g
];

for(var year = YEAR_MAX; year >= YEAR_MIN; year--){
	for(var month = 12; month >= 1; month--){
		line = src + "/" + year + "/" + month;
		for(var i = 0; i <= format.length; i++)
			s.getObjectLink(
				line, 
				format[i], 
				function(d){
					if(!d)
						return;
					console.log(d);
				}, debug
			)
		}
}
