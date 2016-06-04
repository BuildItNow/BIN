define(
{
	name        : "BIN Framework",		// Name of the application
	appID       : "com.bin.example",
	version     : "1.0.0",						// Applicatoin version	
	pageIOAnim  : "rightIO",					// Default page in/out animation
	runtime     : "DEBUG",				// runtime config
	placeholder : "bin/res/img/placeholder.jpg",					    
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
		},
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
			NativeManager:"bin/native/nativeManager",
			MapManager:"bin/core/mapManager",
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
		},
	}
});