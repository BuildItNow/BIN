define([], function()
{
	var ViewManager = function()
	{

	}

	ViewManager.extend = bin.extend;

	var pro = ViewManager.prototype;

	pro.init = function()
	{
		this._views = {};
	}

	pro.getView  = function(name)
	{
		return this._views[name];
	}

	pro.newView = function(options, cb)
	{
		var self     = this;
		options = options || {};
		if(options.autoRender === undefined)
		{
			options.autoRender = true;
		}

		if((options.elem || options.html) && options.noPlugin === undefined)
		{
			options.noPlugin = true;
		}

		//var noPlugin = (options.elem && options.root) || options.noPlugin;
		this.loadViewClass(options.path, function(ViewClass)
		{
			var view = ViewClass.create(options);
			// if(noPlugin)
			// {
			// 	view = ViewClass.create(options);
			// }
			// else
			// {
			// 	options.elemParent = options.elemParent || options.elem;
			// 	view = ViewClass.create(options);
			// 	if(options.elemParent)
			// 	{
			// 		view.render();
			// 		//$(options.elem).append(view.$());
			// 		view.show();
			// 	}
			// }

			var name = options.name || options.path;

			self._views[name] = view;

			if(cb)
			{
				cb(view);
			}
		}, options.noPlugin);
	}

	pro.delView = function(name)
	{
		var view = this._views[name];
		if(view)
		{
			view.remove();
			this._views[name] = null;
			delete this._views[name];
		}
	}

	pro.loadViewClass = function(path, cb, noPlugin)
	{
		require([(noPlugin ? path : "view!"+path)], cb);
	}

	return ViewManager;
});