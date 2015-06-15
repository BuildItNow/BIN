define
(
    ["underscore"],
    function(_)
    {
        var defaultDelay = 5;
        var Class = 
        {
            
        };
        
        Class.delayCall = function(fn, tm)
        {
            tm = tm || defaultDelay;
            
            setTimeout(fn, tm);
        }

        Class.nextTick = function(fn)
        {
            setTimeout(fn, 0);
        }

        Class.clone = function(obj, deep)
        {
            if(!deep)
            {
                return _.clone(obj);
            }

            if (!_.isObject(obj)) return obj;

            if(_.isArray(obj))
            {
                return obj.slice();
            } 

            var ret = {};
            for(var key in obj)
            {
                ret[key] = Class.clone(obj[key], deep);    
            }

            return ret;
        }

        Class.time = function()
        {
            return Class.date().getTime();
        } 

        Class.date = function()
        {
            return new Date();
        }
        
        return Class;
    }
        
);