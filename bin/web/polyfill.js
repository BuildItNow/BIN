(function()
{
    // Fix IE 8 : console not define
    if(!window.console)
    {
        var c = {}; 
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
        window.console = c;
    }

    // Fix IE 8 : String.startsWith String.endsWith
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