define(function()
{
	var Class = {};

	Class.toLeftSlash = function(path)
	{
		return path.replace(/\\/g, '/');
	}

	return Class;
});