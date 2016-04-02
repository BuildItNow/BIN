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
    	this._views  = bin.globalConfig.prloadConfig.views;

    	if(this._views.length > 0)
    	{
    		this.tryLoad();
	    }
    }

    pro.tryLoad = function()
    {
    	if(this._current >= this._views.length)
    	{
    		return ;
    	}

    	var self = this;

    	setTimeout(function()
    	{
    		require(["view!"+self._views[self._current]], 
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
