define([], function()
{
	var Class = {};

    Class.newFragment = function(holder)
    {
    	var ret = $(window.Zepto ? holder : document.createDocumentFragment());
    	ret._binDatas = {holder:holder};

    	ret.setup = function(holder)
    	{
    		if(window.Zepto)
    		{
    			return ;
    		}
    		holder = holder || this._binDatas.holder;
    		holder.append(this);
    	}
        
        if(!window.Zepto)
        {
            ret.empty = function()
            {
                if(ret._binDatas.holder)
                {
                    ret._binDatas.holder.empty();
                }
            }
        }
    	
    	ret.holder = function()
    	{
    		return ret._binDatas.holder;
    	}

    	return ret;
    }

    Class.clone = function(obj, deep)
    {
        if(!deep)
        {
            return _.clone(obj);
        }

        if (!_.isObject(obj)) return obj;

        var ret = undefined;
        if(_.isArray(obj))
        {
            ret = [];
            for(var i=0,i_sz=obj.length; i<i_sz; ++i)
            {
                ret.push(Class.clone(obj[i], deep));   
            }

            return ret;
        } 
        else if(_.isFunction(obj))
        {
            return obj;
        }
        else
        {
            ret = {};
            for(var key in obj)
            {
                ret[key] = Class.clone(obj[key], deep);    
            }

            return ret;
        }
    }

    Class.dump = function(obj)
    {
        var showed = [];
        if(obj === null || obj === undefined)
        {
            return "["+obj+"]";
        }

        var padding  = function(len)
        {
            var ret = "";
            for(var i=0; i<len; ++i)
            {
                ret += "  ";
            }

            return ret;
        }

        var memberPadding = function(len)
        {
            return padding(len+1);
        }

        var toString = null;

        toString = function(obj, len)
        {
            len = len || 0;

            var ret = "";

            if(showed.indexOf(obj) >= 0)
            {
                return ret;
            }
            showed.push(obj);

            if(_.isArray(obj))
            {
                if(len > 3)
                {
                    ret += padding(len)+"[...]";
                }
                else
                {
                    ret += padding(len)+"[\n";
                    var t = null;
                    for(var i=0; i<obj.length; ++i)
                    {
                        if(i>0)
                        {
                            ret += ",\n";   
                        }
                        t = typeof(obj[i]);
                        
                        if(t === "function")
                        {
                            ret += memberPadding(len)+"[function]";
                        }
                        else if(_.isArray(obj[i]) || _.isObject(obj[i]))
                        {
                            ret += toString(obj[i], len+1);
                        }
                        else
                        {
                            ret += memberPadding(len)+obj[i]; 
                        }
                    }
                    ret += "\n"+padding(len)+"]";
                }
            }
            else
            {
                if(len > 3)
                {
                    ret += padding(len)+"{...}";
                }
                else
                {
                    ret += padding(len)+"{\n";
                    var t = null;
                    var v = null;
                    var f = true;
                    for(var key in obj)
                    { 
                        if(!f)
                        {
                            ret += ",\n";
                        }

                        f = false;
                        v = obj[key];
                        t = typeof(v);
                        ret += memberPadding(len)+key+":";
                        if(t === "function")
                        {
                            ret += "[function]";
                        }
                        else if (_.isArray(v) || _.isObject(v)) 
                        {    
                            var s = toString(v, len+1);
                            ret += s.length > 0 ? "\n"+s : "[showed]";    
                        }
                        else
                        {
                            ret += v; 
                        }                               
                    }
                    ret += "\n"+padding(len)+"}";
                }
            }

            return ret;
        }

        var ret = null;
        var t   = typeof(obj);
        if(t === "function")
        {
            ret = "[function]";
        }
        else if(t === "object")
        {
            ret = toString(obj);
        } 
        else
        {
            ret = obj+"";
        }
        
        return ret;
    }

    return Class;
});