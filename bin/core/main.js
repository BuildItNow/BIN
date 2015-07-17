define([bin.globalConfig.application ? bin.globalConfig.application : "bin/core/application"],
function(Application)
{
	var main = function()
	{
		var app = new Application({});
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
		
		app.run();

		return app;
	}

	return main;
})