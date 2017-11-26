var __bin__start__time = new Date().getTime();

/**
 * The root namespace of BIN framework.
 * @namespace 
 */
var bin = {};

/**
 * The root namespace of cordova framework.
 * NB: Only available for hybrid app. 
 * @namespace 
 * @see {@link http://cordova.apache.org/|Cordova}
 */
var cordova = typeof cordova === "undefined" ? undefined : cordova;


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

  	bin.queryParams = (function() 
  	{
  		var ret = {};

  		var i = window.location.href.indexOf("?");
  		if(i<0)
  		{
  			return ret;
  		}
  		var queryString = window.location.href.substring(i+1);
        
  		i = queryString.lastIndexOf("#");
  		if(i>=0)
  		{
  			queryString = queryString.substring(0, i);
  		}

  		if(!queryString)
  		{
  			return ret;
  		}

		queryString = decodeURI(queryString);

        var pairs = queryString.split("&");
        var v = null;
        var pair = null;
        for(i = 0; i < pairs.length; ++i) 
        {
            pair = pairs[i].split('=');
            if(pair.length === 2)
            {
                v = pair[1]
                if(v && v.length >= 6 && v.substr(0, 6) === "_json_")
                {
                    v = v.substr(6);
                    v = JSON.parse(v);
                }
                ret[pair[0]] = v;
            }
        }

		return ret;
	})();

	// Setup platform info
	/**
	 * Platform information, you can use it to check what system your code is running on, android, ios or browser.
	 * NB: Only available for SPA.
	 * @memberof bin
	 * @namespace
	 */
	bin.platform = {};
	if(cordova)
	{
		/**
		 * Platform type, available values are "android","ios","browser"
		 * @memberof bin.platform
		 */
		bin.platform.type = cordova.platformId;

		/**
		 * Quick type checking for android, equivalent to bin.platform.type === "android"
		 * @memberof bin.platform
		 */
		bin.platform.android = bin.platform.type === "android";

		/**
		 * Quick type checking for ios, equivalent to bin.platform.type === "ios"
		 * @memberof bin.platform
		 */
		bin.platform.ios     = bin.platform.type === "ios";
	}
	else
	{
		bin.platform.type = "browser";
		/**
		 * Quick type checking for browser, equivalent to bin.platform.type === "browser"
		 * @memberof bin.platform
		 */
		bin.platform.browser = true;
	}

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
require.config(
{
	baseUrl:'./', 
	packages:[],
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
		prloader: "bin/3rdParty/requirejs-prloader/prloader",
		hammer:"bin/3rdParty/hammerjs/hammer",
		vue:"bin/3rdParty/vue/vue"
	},
	waitSeconds: 5,
	shim: {}
});

require(["config/bpf_hash_globalConfig", "bin/bpf_hash_polyfill"], function(globalConfig)
{
	bin.globalConfig  = globalConfig;
	bin.runtimeConfig = globalConfig[globalConfig.runtime || "RELEASE"] || {};
	bin.classConfig   = globalConfig.classConfig || {};
	bin.componentConfig = globalConfig.componentConfig || {};

	var onPackageLoadedOnce = false;
	var onPackageLoaded = function()
	{
		if(onPackageLoadedOnce)
		{
			return ;
		}
		onPackageLoadedOnce = true;

		require.config(globalConfig.requireConfig);
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
				require(['domReady!', 'bin/core/main'], function(domReady, main) 
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

					if(bin.runtimeConfig.usePRLoader)
					{
						require(["prloader"], function(PRLoader)
						{
							var prLoader = new PRLoader();
							prLoader.init();
						});
					}
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

	if(bin.globalConfig.packages)
	{
		require([].concat(bin.globalConfig.packages), function()
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


