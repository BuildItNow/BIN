// bin frame-work namespace
var bin = {};
// cordova framw-work namespace
var cordova = typeof cordova === "undefined" ? undefined : cordova;

require.config({baseUrl:'./'});

require(["config/globalConfig"], function(globalConfig)
{
	require.config(globalConfig.requireConfig);

	bin.globalConfig  = globalConfig;
	bin.runtimeConfig = globalConfig[globalConfig.runtime ? globalConfig.runtime : "RELEASE"];
	bin.classConfig   = globalConfig.classConfig;
	// load pre-require libs
	require(["jquery", "underscore", "backbone"], function(jquery, underscore, backbone)	
	{
		$ = jquery;
		_ = underscore;
		Backbone = backbone;

		// Re-define extend, support other feature
		var extend = Backbone.View.extend;
		bin.extend = function()
		{
			var cls = extend.apply(this, arguments);
			cls.prototype.__$class = cls;

			return cls;
		}

		var bbClasses = [Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View, Backbone.History];
		_.each(bbClasses, function(Class)
		{
			Class.extend = bin.extend;
			Class.prototype.__$class = Class;
		});
		
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