define(["bin/common/extend"], function(extend)
{
	var ListItemProvider = function()
	{

	}

	ListItemProvider.extend = extend;

	var Class = ListItemProvider.prototype;

	Class.constructor = function(options)
	{

	}

	Class.createItemView = function(listView, i, data)
	{
		return null;
	}

	return ListItemProvider;
});