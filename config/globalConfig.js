define(
{
	name        : "BIN Framework",		// Name of the application
	version     : "1.0.0",						// Applicatoin version	
	pageIOAnim  : "rightIO",					// Default page in/out animation
	runtime     : "DEBUG",				// runtime config
	placeholder : "/bin/res/img/placeholder.jpg",					    
	//left   : 20,
	//top    : 20,
	//width  : 320,
	//height : 568,
	DEBUG : 
	{
		debug : true,
		useNetLocal : true,
		server : "http://localhost:8081",
		timeout : 20000,
		maxCacheDuration : 20000,
	},	
	RELEASE :
	{
		debug : false,
		useNetLocal : true,
		server : "http://localhost:8081",
		timeout : 20000,
		maxCacheDuration : 1*24*60*60*1000,
	},

	requireConfig:
	{
		packages : 
		[],
		paths: 
		{
			// 3rdParty path
			"3rdParty" : "bin/3rdParty",
			
			// equirejs plugins
			text: 'bin/3rdParty/requirejs-text/text',
			domReady: 'bin/3rdParty/requirejs-domready/domReady',
			i18n: 'bin/3rdParty/requirejs-i18n/i18n',
			css: 'bin/3rdParty/require-css/css',
			view: 'bin/requirePlugin/requirejs-view',

			// 3rdParty libs
			jquery: 'bin/3rdParty/jquery/jquery',
			underscore: 'bin/3rdParty/underscore/underscore',
			backbone: 'bin/3rdParty/backbone/backbone',
			fastclick: 'bin/3rdParty/fastclick/fastclick',
			iscroll: 'bin/3rdParty/iscroll/iscroll-probe',
			swiper: 'bin/3rdParty/swiper/swiper',
			md5: 'bin/3rdParty/md5/md5',
			hammer: 'bin/3rdParty/hammerjs/hammer',

			// Add your paths here
		},
		waitSeconds: 5,
		shim: 
		{
		}
	},

	classConfig:
	{
		// There is no dependency relation here, it's just a class hierarchy
		core:
		{
			Application:"bin/core/application",
			DebugManager: "bin/core/debugManager",
			NetManager:
			{
				_path:"bin/core/netManager",
				CachePolicy:"bin/core/netPolicy/netCachePolicy",
				CallbackPolicy:"bin/core/netPolicy/netCallbackPolicy",
				DebugPolicy:"bin/core/netPolicy/netDebugPolicy",
				SendCheckPolicy:"bin/core/netPolicy/netSendCheckPolicy",	
			},
			DataCenter:"bin/core/dataCenter",
			HUDManager:"bin/core/hudManager",	
			NavigationController:"bin/core/navigationController",
		},
		ui:
		{
			View:"bin/core/view",
			PageView:"bin/core/pageView",
			NaviPageView:"bin/core/naviPageView",
		},
		util:
		{
			osUtil:"bin/util/osUtil",
			disUtil:"bin/util/disUtil",
			elemUtil:"bin/util/elemUtil",
			lsUtil:"bin/util/lsUtil",
			ssUtil:"bin/util/ssUtil",
			pathUtil:"bin/util/pathUtil",
		},
	}
});