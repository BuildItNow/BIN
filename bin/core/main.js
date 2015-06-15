define(["jquery", bin.globalConfig.application ? bin.globalConfig.application : "bin/core/application"],
function($, Application)
{
	var main = function()
	{
		var app = new Application({});
		app.init();

		console.info("-------------------------------");
		console.info("APP name : "+bin.globalConfig.name);
		console.info("APP runtime : "+bin.globalConfig.runtime);
		console.info("APP Server : "+bin.runtimeConfig.server);
		console.info("APP use net local : "+bin.runtimeConfig.useNetLocal);
		console.info("APP debug : "+bin.runtimeConfig.debug);
		console.info("-------------------------------");
		
		console.info("APP Start up ");
		
		app.run();

		return app;
	}

	return main;
})