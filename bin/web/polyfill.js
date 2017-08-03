(function()
{
    // Fix IE 8 : Object.keys
    if(!Object.keys)
    {
        var DONT_ENUM =  "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
        hasOwn = Object.prototype.hasOwnProperty;
        var testObject = {toString : 1};
        for (var i in testObject)
        {
            DONT_ENUM = false;
        }
     
        Object.keys = function(obj)
        {//ecma262v5 15.2.3.14
            var result = [];
            for(var key in obj ) 
            {
                if(hasOwn.call(obj, key))
                {
                    result.push(key) ;
                }
            }
            
            if(DONT_ENUM && obj)
            {
                for(var i = 0 ;key = DONT_ENUM[i++]; )
                {
                    if(hasOwn.call(obj, key))
                    {
                        result.push(key);
                    }
                }
            }

            return result;
        }
    }

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