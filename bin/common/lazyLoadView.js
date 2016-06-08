define(
    [
        "bin/core/view"
    ],
    function (Base)
    {   
    	var Class = {};

    	Class.posGenHTML = function()
    	{
    		Base.prototype.posGenHTML.call(this);

            this._type = this.$().data("bin-type") || "image";
            this._loaded = this.$().data("bin-loaded") || this.$().data("loaded");

            if(!this._loaded && this._type === "image")
            {
                var placeholder = this.$().data("bin-placeholder") || this.$().data("placeholder") || bin.globalConfig.placeholder;
                this._setPlaceHolder(placeholder);
            }
    	}

    	Class.loaded = function()
    	{
    		return this._loaded;
    	}

        Class.type = function()
        {
            return this._type;
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
    		this.$().attr("data-bin-loaded", true);
    		
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
            elem.css("position", "absolute");

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

        Class.remove = function()
        {
            this._loaded = true;

            this.onRemove();
        }

    	return Base.extend(Class);
    }
);