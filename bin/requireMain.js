// bin frame-work namespace
var bin = {};
// cordova framw-work namespace
var cordova = window.cordova;

require.config({baseUrl:'./'});

// load config
require(["bin/core/setupConfig"], function()
{
	// load pre-require libs
	require(["jquery", "underscore", "backbone"], function(jquery, underscore, backbone)	
	{
		$ = jquery;
		_ = underscore;
		Backbone = backbone;
		
		// do our job
		require(['domReady!', 'bin/util/fastclickUtil', 'bin/core/main'],  function(domReady, fastclickUtil, main)
		{
			//ios7 issue fix
			if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) 
			{
	  			$('html').addClass('ipad ios7');
			}
			//iOS scroll to top
			setTimeout(function() {window.scrollTo(0, 1);}, 0);

			//enable fastclick
			fastclickUtil.attach(document.body);

			main();
		});
	});
});