define([], function()
{
	var MapManager = function()
	{

	}

	MapManager.extend = bin.extend;

	var Class = MapManager.prototype;


	Class.init = function()
	{
		this.require(function(err)
		{
			if(err)
			{
				console.log("Initialize map fail");
			}
			else
			{
				console.log("Initialize map succeed");
			}
		});
		console.info("Map module initialize");
	}

	Class.require = function(cb)
	{
		require(["map!"], function()
		{
			cb(null);
		}, function(err)
		{
			require.undef(err.requireModules[0]);

			cb(err);
		});
	}


	_.extend(Class, Backbone.Events);

	return MapManager;
});