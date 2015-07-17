define(
	[],
	function()
	{
		var Class = {};

		Class.jsonAttr = function(elem, name)
	    {
	    	var json = elem.attr(name);

	    	return json ? JSON.parse(json) : null;
	    }

	    Class.newFragment = function(holder)
	    {
	    	var ret = $(document.createDocumentFragment());
	    	ret._binDatas = {holder:holder};

	    	ret.setup = function(holder)
	    	{
	    		holder = holder || this._binDatas.holder;
	    		holder.append(this);
	    	}
	    	ret.empty = function()
	    	{
	    		if(ret._binDatas.holder)
	    		{
	    			ret._binDatas.holder.empty();
	    		}
	    	}
	    	ret.holder = function()
	    	{
	    		return ret._binDatas.holder;
	    	}

	    	return ret;
	    }


	    return Class;
	}
);