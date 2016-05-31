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
                view._setImage(img);
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
            if(!image || image.width <= 1 || image.height <= 1)
            {
                return ;
            }

    		this._setPlaceHolder("");

            var elem = $(image);
            elem.addClass("bin-lazyload-content");

            var w = this.$().width();
            var h = this.$().height();
            var s = w/h;
            var is = image.width/image.height;

            var align = this.$().data("align");
            if(align === "center")
            {
                if(is > s)
                {
                    var ih = w/is;
                    elem.css({left:"0px",top:(h-ih)*0.5+"px", width:"100%",height:ih+"px"});
                }
                else
                {
                    var iw = h*is;
                    elem.css({left:(w-iw)*0.5+"px",top:"0px", width:ih+"px",height:"100%"});
                }
            }
            else if(align === "vcenter")
            {
                var ih = w/is;
                elem.css({left:"0px",top:(h-ih)*0.5+"px", width:"100%",height:ih+"px"});
            }
            else if(align === "hcenter")
            {
                var iw = h*is;
                elem.css({left:(w-iw)*0.5+"px",top:"0px", width:ih+"px",height:"100%"});
            }
            else
            {
                elem.css({left:"0px",top:"0px", width:"100%",height:"100%"});
            }

            elem.hide();

            this.$().append(elem);

            var effect = this.$().data("effect");
            if(effect === "fadein")
            {
                elem.fadeIn();
            }
            else
            {
                elem.show();
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