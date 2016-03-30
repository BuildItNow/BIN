// bin frame-work namespace
var bin = {};
// cordova framw-work namespace
var cordova = typeof cordova === "undefined" ? undefined : cordova;

// Setup platform info
bin.platform = {};
if(cordova)
{
	bin.platform.type = cordova.platformId;

	bin.platform.android = bin.platform.type === "android";
	bin.platform.ios     = bin.platform.type === "ios";
}
else
{
	bin.platform.type = "browser";
	bin.platform.browser = true;
}

// Config the core lib
require.config(
{
	baseUrl:'./', 
	packages:[],
	paths: 
	{
		// 3rdParty path
		"3rdParty": "bin/3rdParty",

		// equirejs plugins
		text: 'bin/3rdParty/requirejs-text/text',
		domReady: 'bin/3rdParty/requirejs-domready/domReady',
		i18n: 'bin/3rdParty/requirejs-i18n/i18n',
		css: 'bin/3rdParty/require-css/css',
		view: 'bin/requirePlugin/requirejs-view',
		map: 'bin/requirePlugin/requirejs-map',

		// 3rdParty libs
		jquery: 'bin/3rdParty/jquery/jquery',
		underscore: 'bin/3rdParty/underscore/underscore',
		backbone: 'bin/3rdParty/backbone/backbone',
		fastclick: 'bin/3rdParty/fastclick/fastclick',
		iscroll: 'bin/3rdParty/iscroll/iscroll-probe',
		swiper: 'bin/3rdParty/swiper/swiper',
		md5: 'bin/3rdParty/md5/md5',
		lzstring: "bin/3rdParty/lz-string/lz-string",
		lsloader: "bin/3rdParty/requirejs-lsloader/lsloader"
	},
	waitSeconds: 5,
	shim: {}
});

require(["jquery", "underscore", "backbone", "lzstring"], function(jquery, underscore, backbone, lzString)
{
	$ = jquery;
	_ = underscore;
	Backbone = backbone;
	LZString = lzString;

	// Re-define extend, support other feature
	var extend = Backbone.View.extend;
	bin.extend = function() {
		var cls = extend.apply(this, arguments);
		cls.prototype.__$class = cls;

		return cls;
	}

	var bbClasses = [Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View, Backbone.History];
	_.each(bbClasses, function(Class) {
		Class.extend = bin.extend;
		Class.prototype.__$class = Class;
	});

	
	require(["config/globalConfig"], function(globalConfig)
	{
		bin.globalConfig  = globalConfig;
		bin.runtimeConfig = globalConfig[globalConfig.runtime ? globalConfig.runtime : "RELEASE"];
		bin.classConfig   = globalConfig.classConfig;

		var start = function()
		{
			require.config(globalConfig.requireConfig);

			require(['domReady!', 'bin/util/fastclickUtil', 'bin/core/main'], function(domReady, fastclickUtil, main) 
			{
				//ios7 issue fix
				if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) 
				{
					$('html').addClass('ipad ios7');
				}
				//iOS scroll to top
				setTimeout(function() 
				{
					window.scrollTo(0, 1);
				}, 0);

				//enable fastclick
				fastclickUtil.attach(document.body);
				main();
			});
		}

		if(bin.runtimeConfig.useLSCache)
		{
			var lsLoader   = null;
			var cachesJSON = null;
			var handler = function()
			{
				if(!lsLoader || !cachesJSON)
				{
					return ;
				}

				lsLoader.init(cachesJSON);
				require.config(
				{
					loader:function(url, onLoad, onError)
					{
						return lsLoader.load(url, onLoad, onError);
					}
				});

				bin.lsLoader = lsLoader;

				start();
			}
			$.ajax(
			{
				url:"/local-caches.json",
				type:"get",
				dataType:"text",
				success:function(data)
				{
					cachesJSON = data;

					handler();
				},
				error:function()
				{
					start();
				}
			});
			require(["lsloader"], function(LSLoader)
			{	
				lsLoader = new LSLoader();

				handler();
			});
		}
		else
		{
			start();
		}
	});
});


