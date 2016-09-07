var __bin__start__time = new Date().getTime();

// bin frame-work namespace
var bin = {};

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
		//jquery: 'bin/3rdParty/zepto/zepto',
		jquery: 'bin/3rdParty/jquery/jquery',
		underscore: 'bin/3rdParty/underscore/underscore',
		backbone: 'bin/3rdParty/backbone/backbone',
		fastclick: 'bin/3rdParty/fastclick/fastclick',
		iscroll: 'bin/3rdParty/iscroll/iscroll-probe',
		swiper: 'bin/3rdParty/swiper/swiper',
		md5: 'bin/3rdParty/md5/md5',
		lzstring: "bin/3rdParty/lz-string/lz-string",
		lsloader: "bin/3rdParty/requirejs-lsloader/lsloader",
	},
	waitSeconds: 5,
	shim: {}
});

(function()
{
	var onPackageLoadedOnce = false;
	var onPackageLoaded = function()
	{
		if(onPackageLoadedOnce)
		{
			return ;
		}

		onPackageLoadedOnce = true;
		require(["jquery", "underscore", "backbone", "lzstring", "config/globalConfig"], function(jquery, underscore, backbone, lzString, globalConfig)
		{
			$ = jquery;
			_ = underscore;
			Backbone = backbone;
			LZString = lzString;

			var extend = Backbone.View.extend;
			bin.extend = function() {
				var cls = extend.apply(this, arguments);
				cls.prototype.__$class = cls;
				cls.prototype.__$super = this;
				cls.__$super = this;

				return cls;
			}

			var bbClasses = [Backbone.Router, Backbone.View, Backbone.History];
			_.each(bbClasses, function(Class) {
				Class.extend = bin.extend;
				Class.prototype.__$class = Class;
			});
			
			bin.globalConfig  = globalConfig;
			bin.globalConfig.pageConfig = typeof pageConfig === "undefined" ? {} : pageConfig;
			bin.runtimeConfig = globalConfig[globalConfig.runtime ? globalConfig.runtime : "RELEASE"];
			require.config(globalConfig.requireConfig);
			bin.classConfig = globalConfig.classConfig;
			
			var start = function()
			{
				require.config(globalConfig.requireConfig);

				require(['domReady!', 'bin/web/core/main'], function(domReady, main) 
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
					url:"./local-caches.json",
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
	};

	var packages = ["config/globalConfig"];
	if(typeof pageConfig !== "undefined")
	{
		packages = packages.concat(pageConfig.packages);
	}

	require(packages, function()
	{
		onPackageLoaded();
	}, function()
	{
		onPackageLoaded();
	});
})();


