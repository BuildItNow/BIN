define(
	function()
	{
		var cls = {};

		cls.clientWidth  	 = document.body.offsetWidth;
	    cls.clientHeight     = document.body.offsetHeight;;
	    cls.navHeight        = 38;
	    cls.navClientHeight  = cls.clientHeight-cls.navHeight;
	    cls.navClientWidth   = cls.clientWidth;

	    return cls;
	}
);