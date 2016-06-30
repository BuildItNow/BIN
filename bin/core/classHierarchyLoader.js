define([], function()
{
	var hierarchyDone = false;

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

	

	var Class = {};

	Class._cbs = [];

	Class.load = function(cb)
	{
		var self = this;

		var onDone = function()
		{
			hierarchyDone = true;
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

		load(bin.classConfig, function(ret)
		{
			_.extend(bin, ret);

			onDone();
		});
	}

	Class.onLoad = function(cb)
	{
		if(hierarchyDone)
		{
			setTimeout(cb, 0);
		}
		else
		{
			this._cbs.push(cb);
		}
	}

	return Class;
});