define(
	function()
	{
		var cls = {};

		cls.save = function(name, data)
	    {
	        window.sessionStorage[name] = JSON.stringify(data);
	    }
	        
	    cls.load = function(name)
	    {
	    	var ret = window.sessionStorage[name];

	    	return ret ? JSON.parse(ret) : null;
	    }

	    cls.clear = function(name)
	    {
	    	window.sessionStorage[name] = null;
	    }

	    return cls;
	}
);