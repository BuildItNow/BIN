define(["bin/core/classHierarchyLoader"], 
function(CHLoader)
{
	CHLoader.load();
	
	var main = function()
	{	
		CHLoader.onLoad(function()
		{
			var app = new bin.core.Application({});
			app.init();

			console.info("-------------------------------");
			console.info("APP name : "+bin.globalConfig.name);
			console.info("APP version : "+bin.globalConfig.version);
			console.info("APP root html: "+window.location.pathname);
			console.info("APP runtime : "+bin.globalConfig.runtime);
			console.info("APP runtime config : ");
			console.info(bin.runtimeConfig);
			console.info("-------------------------------");
				
			console.info("APP Start up ");

			app.fireReady();
				
			app.run();
		});
	}

	return main;
})
