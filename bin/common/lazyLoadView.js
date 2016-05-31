define(
    [
        "bin/core/view",
        "bin/util/osUtil", 
    ],
    function (Base, osUtil)
    {   
        var loadingQueue = [];
        var loadingTimer = null;

        var loadTimer = function()
        {
            var view = loadingQueue.shift();
            if(!view)
            {
                clearInterval(loadingTimer);
                loadingTimer = null;

                return ;
            }

            var img = new Image();
            img.src = view._image;

            img.onload = function()
            {
                view._setImage(view._image);
            }
        }

        var loadLazyImage = function(view)
        {
            loadingQueue.push(view);

            if(!loadingTimer)
            {
                loadingTimer = setInterval(loadTimer, 100);
            }
        }

    	var Class = {};

    	Class.posGenHTML = function()
    	{
    		Base.prototype.posGenHTML.call(this);
    		
    		var placeHolder = this.$().data("placeholder") || bin.globalConfig.placeholder;
    		this._setPlaceHolder(placeHolder);
    		
    		this._image  = this.$().data("image");
            this._loaded = this.$().data("loaded");
    	}

    	Class.loaded = function()
    	{
    		return this._loaded;
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

            this._loaded = true;
    		this.$().attr("data-loaded", true);
    		
    		loadLazyImage(this);

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