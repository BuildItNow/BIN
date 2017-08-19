var __bin__start__time = new Date().getTime();

// bin frame-work namespace
var bin  = {};
var page = {};

if(!window.pageConfig)
{
	window.pageConfig = {};
}

(function()
{
	var toString = Object.prototype.toString;

	bin.isObject = function(obj) 
	{
    	return !!(obj && typeof obj === "object" && obj === Object(obj));
  	};

  	var genFunc = function(name)
  	{
  		return function(obj)
  		{
  			return toString.call(obj) == "[object "+name+"]";
  		}
  	}

  	var types = ["Array", "Function", "String", "Number", "Date", "RegExp"];
  	for(var i=0,i_sz=types.length; i<i_sz; ++i)
  	{
  		bin["is"+types[i]] = genFunc(types[i]);
  	}

  	if(Array.isArray)
  	{
  		bin.isArray = Array.isArray;
  	}

  	if (typeof (/./) !== "function") 
  	{
    	bin.isFunction = function(obj) 
    	{
      		return typeof obj === "function";
    	};
  	}

  	bin.isNaN = function(obj) 
  	{
    	return bin.isNumber(obj) && obj != +obj;
  	};

  	bin.isBoolean = function(obj) 
  	{
    	return obj === true || obj === false || toString.call(obj) == "[object Boolean]";
  	};

  	bin.isNull = function(obj) 
  	{
    	return obj === null;
  	};

  	bin.isUndefined = function(obj) 
  	{
    	return obj === void 0;
  	};

  	bin.isNU = function(obj)
  	{
  		return bin.isUndefined(obj) || bin.isNull(obj);
  	}

  	// From http://keenwon.com/demo/201402/js-check-browser.html
  	var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    
    bin.platform = Sys;
    bin.platform.browser = true;
})();

require.onError = function(err)
{
	if(err.requireType === "timeout" && err.requireModules)
	{
		for(var i=0,i_sz=err.requireModules.length; i<i_sz; ++i)
		{
			require.undef(err.requireModules[i]);
		}
	}

	console.error(err);
}

// Config the core lib
require.config({
	baseUrl:'./', 
	packages:
	[
	],
	paths: 
	{
		// requirejs plugins
		text: 'bin/3rdParty/requirejs-text/text',
		domReady: 'bin/3rdParty/requirejs-domready/domReady',
		i18n: 'bin/3rdParty/requirejs-i18n/i18n',
		css: 'bin/3rdParty/require-css/css',
		view: 'bin/requirePlugin/requirejs-view',
		html: 'bin/requirePlugin/requirejs-html',
		map: 'bin/requirePlugin/requirejs-map',

		// 3rdParty libs
		//jquery: 'bin/3rdParty/zepto/zepto',
		jquery: 'bin/3rdParty/jquery/2.2.5/jquery',
		underscore: 'bin/3rdParty/underscore/underscore',
		backbone: 'bin/3rdParty/backbone/backbone',
		fastclick: 'bin/3rdParty/fastclick/fastclick',
		iscroll: 'bin/3rdParty/iscroll/iscroll-probe',
		swiper: 'bin/3rdParty/swiper/swiper',
		md5: 'bin/3rdParty/md5/md5',
		lzstring: "bin/3rdParty/lz-string/lz-string",
		lsloader: "bin/3rdParty/requirejs-lsloader/lsloader",
		hammer:"bin/3rdParty/hammerjs/hammer",
		vue:"bin/3rdParty/vue/vue",

		bootstrap:"bin/web/3rdParty/bootstrap/3.3.7/js/bootstrap",
		layerui:"bin/web/3rdParty/layer-3.0.3/src/layer",
		plupload:"bin/web/3rdParty/plupload-2.3.1/js/plupload.dev",
		moxie:"bin/web/3rdParty/plupload-2.3.1/js/moxie",

		adminlte:"bin/web/3rdParty/adminlte-2.3.11/dist/js/app",
		icheck:"bin/web/3rdParty/adminlte-2.3.11/plugins/iCheck/icheck",
		jquery_datatable:"bin/web/3rdParty/adminlte-2.3.11/plugins/datatables/jquery.dataTables",
		datatable:"bin/web/3rdParty/adminlte-2.3.11/plugins/datatables/dataTables.bootstrap"
	},
	waitSeconds: 5,
	shim: 
	{
		plupload:"moxie",
		adminlte:["jquery", "bootstrap"],
		icheck:["jquery"],
		jquery_datatable:["jquery"],
		datatable:["jquery_datatable", "bootstrap"]
	}
});

require(["config/globalConfig", "bin/web/polyfill"], function(globalConfig)
{
	bin.globalConfig  = globalConfig;
	bin.runtimeConfig = globalConfig[globalConfig.runtime || "RELEASE"];
	bin.classConfig = globalConfig.classConfig;
	bin.componentConfig = globalConfig.componentConfig || {};

	page.pageConfig   = pageConfig;
	page.classConfig  = pageConfig.classConfig;
	page.onInit = pageConfig.onInit;
	page.onRun  = pageConfig.onRun;

	require.config(globalConfig.requireConfig);
	if(pageConfig.requireConfig)
	{
		require.config(pageConfig.requireConfig);
	}

	var config = {paths:{}};
	if(bin.platform.ie && bin.platform.ie < 9)
	{
		if(bin.isNU(pageConfig.jquery))
		{
			pageConfig.jquery = "1.x";

			console.warn("Browser is too low, use JQuery 1.x");
		}

		if(bin.isNU(pageConfig.bootstrap))
		{
			pageConfig.bootstrap = "2.x";

			console.warn("Browser is too low, use Bootstrap 2.x");
		}

		if(bin.isNU(pageConfig.vue))
		{
			pageConfig.vue = false;

			console.warn("Browser is too low, disable Vue");
		}
	}

	if(bin.isNU(pageConfig.jquery))
	{

	}
	else if(pageConfig.jquery === "1.x")
	{
		config.paths["jquery"] = "bin/3rdParty/jquery/1.12.4/jquery";
	}
	else if(pageConfig.jquery === "2.x")
	{

	}
	else if(pageConfig.jquery)
	{
		config.paths["jquery"] = pageConfig.jquery;
	}

	if(bin.isNU(pageConfig.bootstrap))
	{

	}
	if(pageConfig.bootstrap === "2.x")
	{
		config.paths["bootstrap"] = "bin/web/3rdParty/bootstrap/2.3.2/js/bootstrap";
	}
	else if(pageConfig.bootstrap === "3.x")
	{

	}
	else if(pageConfig.bootstrap)
	{
		config.paths["bootstrap"] = pageConfig.bootstrap;
	}

	if(bin.isNU(pageConfig.vue))
	{

	}
	else if(!pageConfig.vue)
	{
		define("vue", null);
		delete config.paths["vue"];
	}
	else if(bin.isString(pageConfig.vue))
	{
		config.paths["vue"] = pageConfig.vue;
	}

	require.config(config);

	var onPackageLoadedOnce = false;
	var onPackageLoaded = function()
	{
		if(onPackageLoadedOnce)
		{
			return ;
		}

		onPackageLoadedOnce = true;
		require(["jquery", "underscore", "backbone", "lzstring"], function(jquery, underscore, backbone, lzString)
		{
			$ = jquery;
			_ = underscore;
			Backbone = backbone;
			LZString = lzString;

			var extend = Backbone.View.extend;
			bin.extend = function() {
				var cls = extend.apply(this, arguments);
				cls.prototype.__$class = cls;
				cls.__$super = this;

				return cls;
			}

			var bbClasses = [Backbone.Router, Backbone.View, Backbone.History];
			_.each(bbClasses, function(Class) {
				Class.extend = bin.extend;
				Class.prototype.__$class = Class;
			});
			
			var start = function()
			{
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

	var packages = [];
	if(bin.globalConfig.packages)
	{
		packages = packages.concat(bin.globalConfig.packages);
	}
	if(pageConfig.packages)
	{
		packages = packages.concat(pageConfig.packages);
	}

	if(packages.length > 0)
	{
		require(packages, function()
		{
			onPackageLoaded();
		}, function()
		{
			onPackageLoaded();
		});
	}
	else
	{
		onPackageLoaded();
	}
});


