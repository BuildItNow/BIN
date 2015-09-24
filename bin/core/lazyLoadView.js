define(
    [
        "bin/core/view",
        "bin/util/osUtil", 
    ],
    function (Base, osUtil)
    {
    	var Class = {};

    	Class.constructor = function(options)
    	{
    		Base.prototype.constructor.call(this, options);

    		this._container = options.container;
    	}

    	Class.posGenHTML = function()
    	{
    		Base.prototype.posGenHTML.call(this);
    		
    		var placeHolder = this.$().data("placeholder") || bin.globalConfig.placeholder;
    		this._setPlaceHolder(placeHolder);
    		
    		this._image  = this.$().data("image");
    	}

    	Class.loaded = function()
    	{
    		return this.$().data("loaded");
    	}

    	Class.update = function(vt, vr, vb, vl)
    	{
    		if(this.loaded())
    		{
    			return true;
    		}

    		var os = this.$().offset();
    		var l = os.left;
    		var t = os.top;
    		var r = l+this.$().width();
    		var b = t+this.$().height();

    		if(    vr <= l
    			|| r <= vl
    			|| b <= vt  
    			|| vb <= t 
    		  )
    		{
    			return false;
    		}

    		this.$().attr("data-loaded", true);
    		
    		var img = new Image();
			img.src = this._image;

			var self = this;
			img.onload = function()
        	{
        		self._setImage(self._image);
        	}

        	return true;
	   	}

    	Class._setImage = function(image)
    	{
    		this._setPlaceHolder("");

    		if (this.$().is("img")) 
    		{
                this.$().attr("src", image);
            } 
            else 
            {
                this.$().css("background-image", "url('" + image + "')");
            }
    	}

    	Class._setPlaceHolder = function(image)
    	{
    		if(image)
    		{
    			this.$().css("background-image", "url('" + image + "')");
    		}
    		else
    		{
    			this.$().css("background-image", "");
    		}
    	}

    	return Base.extend(Class);
    }
);