define(["bin/core/classHierarchyLoader"], 
function(CHLoader)
{
	var loader = new CHLoader(bin.classConfig);

	// Load bin classes
	loader.load();
	
	var main = function()
	{	
		loader.onLoad(function()
		{
			loader = new CHLoader(page.classConfig, page);
			// Load page classes
			loader.load(function()
			{
				var onDone = function()
				{
					var app = new bin.core.Application({});
					app.init();

					if(page.onInit)
					{
						page.onInit();
					}

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

					if(page.onRun)
					{
						page.onRun();
					}

					console.info("BIN start cost "+(new Date().getTime()-__bin__start__time)+" ms");
				}

				if(bin.resolveViewInjectDependencies)
				{
					bin.resolveViewInjectDependencies(document.body, onDone);
				}
				else
				{
					onDone();
				}
			})
		});
	}

	return main;
})