define(
	[
		"bin/core/pageView",
        "bin/util/osUtil", 
    ], 
	function(View, osUtil)
	{

		var Class = 
		{
			
		};

		Class.onViewBack = function(backFrom, backData)
		{
			backData = bin.nativeManager.argsToNative(backData);

			this._nativeObject.exec("onViewBack", [backFrom, backData]);
		}

		Class.onShow = function()
		{
			this._nativeObject.exec("onShow");
		}

		Class.onHide = function()
		{
			this._nativeObject.exec("onHide");
		}

		Class.onRemove = function()
		{
			this._nativeObject.exec("onRemove");
		}

		Class.onLoad = function(args, cb)
		{
			cb();
		}
    	
		return View.extend(Class);
	});