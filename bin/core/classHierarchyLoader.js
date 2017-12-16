define([], function()
{
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

	var ClassHierarchyLoader = function(config, holder)
	{
		this._config = config;
		if(config && config.requireScripts)
		{
			this._scripts  = config.requireScripts;
			delete config.requireScripts;
		}

		this._holder = holder || bin;
		this._hierarchyDone = false;
		this._cbs = [];
	}

	
	var Class = ClassHierarchyLoader.prototype;

	Class.load = function(cb)
	{
		var self = this;

		var onDone = function()
		{
			self._hierarchyDone = true;
			var cbs = self._cbs;
			self._cbs = [];

			setTimeout(function()
			{
				for(var i=0,i_sz=cbs.length; i<i_sz; ++i)
				{
					cbs[i]();
				}
			}, 0);
		}

		if(cb)
		{
			this._cbs.push(cb);
		}

		if(this._config)
		{
			load(this._config, function(ret)
			{
				_.extend(self._holder, ret);

				onDone();
			});
		}
		else
		{
			onDone();
		}

		if(this._scripts)
		{
			require.requireScript(this._scripts);
		}
	}

	Class.onLoad = function(cb)
	{
		if(this._hierarchyDone)
		{
			setTimeout(cb, 0);
		}
		else
		{
			this._cbs.push(cb);
		}
	}

	return ClassHierarchyLoader;
});
