define(function()
{		
	var PRLoader = function()
	{

	}

	PRLoader.extend = bin.extend;

	var pro = PRLoader.prototype;

	pro.init = function()
    {
    	this._current = 0;
    	this._items  = bin.globalConfig.prloadConfig.files;

    	if(this._items.length > 0)
    	{
    		this.tryLoad();
	    }
    }

    pro.tryLoad = function()
    {
    	if(this._current >= this._items.length)
    	{
    		return ;
    	}

    	var self = this;

    	setTimeout(function()
    	{
    		require([self._items[self._current]], 
	    	function()
	    	{
	    		self.tryLoad();
	    	},
	    	function()
	    	{
	    		self.tryLoad();
	    	});

	    	++self._current;
    	}, bin.globalConfig.prloadConfig.interval);	
    }

    return PRLoader;
});
