(function()
{
    // Adds Document & DocumentFragment support for IE9 & Safari.
    (function(constructor) 
    {
        if (!constructor || !constructor.prototype)
        {
            return ;
        }

        var pro = constructor.prototype;
        if(pro.lastElementChild == null)
        {
            Object.defineProperty(pro, 'lastElementChild', {
                get: function() {
                    var node, nodes = this.childNodes, i = nodes.length - 1;
                    while (node = nodes[i--]) {
                        if (node.nodeType === 1) {
                            return node;
                        }
                    }
                    return null;
                }
            });
        }

        if(pro.firstElementChild == null)
        {
            Object.defineProperty(pro, 'firstElementChild', {
                get: function() {
                    var node, nodes = this.childNodes, i = 0;
                    while (node = nodes[i++]) {
                        if (node.nodeType === 1) {
                            return node;
                        }
                    }
                    return null;
                }
            });
        }

        if(pro.nextElementSibling == null)
        {
            Object.defineProperty(pro, 'nextElementSibling', {
                get: function() {
                    var el = this;
                    while (el = el.nextSibling) {
                      if (el.nodeType === 1) {
                          return el;
                      }
                    }
                    return null;
                }
            });
        }

        if(pro.childElementCount == null)
        {
            Object.defineProperty(pro, 'childElementCount', {
                get: function() 
                {
                    var i = 0, count = 0, node, nodes = this.childNodes;
                    while (node = nodes[i++]) 
                    {
                        if (node.nodeType === 1) count++;
                    }
                    return count;
                }
            });
        }

        if(pro.children == null)
        {
            Object.defineProperty(pro, 'children', {
                get: function() {
                    var i = 0, node, nodes = this.childNodes, children = [];
                    while (node = nodes[i++]) {
                        if (node.nodeType === 1) {
                            children.push(node);
                        }
                    }
                    return children;
                }
            });
        }
    })(window.Node || window.Element);

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

    if(bin.platform.ie < 9 || pageConfig.es5sham)
    {
        deps.push("es5shim");
        deps.push("es5sham");
    }
    else if(pageConfig.es5shim)
    {
        deps.push("es5shim");
    }

	define(deps, function()
	{
		return undefined;
	})
})();