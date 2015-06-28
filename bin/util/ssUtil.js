define(
	function()
	{
		var cls = {};

		cls.save = function(name, data)
	    {
	    	if(data === null || data === undefined)
            {
                window.sessionStorage.removeItem(name);
                return ;
            }
            
	        window.sessionStorage[name] = JSON.stringify(data);
	    }
	        
	    cls.load = function(name)
	    {
	    	var ret = window.sessionStorage[name];

	    	return ret ? JSON.parse(ret) : null;
	    }

	    cls.clear = function(name)
	    {
	    	window.sessionStorage.removeItem(name);
	    }

	    return cls;
	}
);