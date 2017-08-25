(function()
{
    if(typeof String.prototype.startsWith !== "function") 
    {
        String.prototype.startsWith = function (prefix)
        {
            return this.slice(0, prefix.length) === prefix;
        };
    }

    if(typeof String.prototype.endsWith !== "function") 
    {
        String.prototype.endsWith = function(suffix) 
        {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

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