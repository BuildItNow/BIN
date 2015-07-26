define(
function()
{
	var hierarchyDone = false;

	Backbone.on("HIDERARCHY_DONE", function()
	{
		hierarchyDone = true;
	});

	var load = null;

	var genLoadTask = function(name, config, cb)
	{
		return function()
		{
			if(typeof(config) === "string")
			{
				require([config], function(ret){cb(name, ret)});
			}
			else
			{
				load(config, function(ret){cb(name, ret)});
			}
		}
	}

	load = function(config, cb)
	{
		var ret  = {};
		var path = config._path;
		
		var c = 0;
		var t = [];
		if(path)
		{
			++c;
			t.push(genLoadTask(null, path, function(name, value)
			{
				--c;

				_.extend(value, ret);
				ret = value;

				if(c === 0)
				{
					cb(ret);
				}
			}));

			delete config._path;
		}

		for(var key in config)
		{
			++c;

			t.push(genLoadTask(key, config[key], function(name, value)
			{
				--c;

				ret[name] = value;

				if(c === 0)
				{
					cb(ret);
				}
			}));
		}

		if(path)
		{
			config._path = path;
		}

		if(c === 0)
		{
			cb();
		}
		else
		{
			for(var i=0,i_sz=t.length; i<i_sz; ++i)
			{
				t[i]();
			}
		}
	}

	load(bin.classConfig, function(ret)
	{
		_.extend(bin, ret);

		Backbone.trigger("HIDERARCHY_DONE");
	});
	
	var main = function()
	{	
		var start = function()
		{
			Backbone.off("HIDERARCHY_DONE");

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
				
			app.run();
		}

		if(hierarchyDone)
		{
			start();
		}
		else
		{
			Backbone.on("HIDERARCHY_DONE", function()
			{
				start();
			});
		}
	}

	return main;
})