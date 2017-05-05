(function()
{
	var deps = [];
	if(typeof Promise === "undefined")
	{
		deps.push("bin/3rdParty/promise/promise");
	}

	define(deps, function()
	{
		return undefined;
	})
})();