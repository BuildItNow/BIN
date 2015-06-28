define(["backbone", "bin/util/elemUtil", "bin/util/osUtil"], function(Backbone, elemUtil, osUtil)
{
	var Base = Backbone.View;

	var Class =  
	{
		// for mannually created view, the view's dom will be created in constructor,
        // if the view is created by butterfly, html will be ignored.   
    	html:null
    };

	Class.constructor = function(options)
	{
		this._show  = null;
		
		if(options && options._autoLoad)   // Load by BIN, BIN will auto set element by html content
        {
            this._html = null;
            
            Backbone.View.call(this, options);

            return ;
        }

        if(options && options.elem)       // Init from a element
        {
            options.el = options.elem;
            options.elem = null;

            Backbone.View.call(this, options);


            //osUtil.nextTick(function()
            //{
                this.render();
                this.show();
            //}.bind(this));

            return ;
        }

        this._html = options && options.html ? options.html : this.html;

       	Backbone.View.call(this, options);

        if(this._html)
        {
            //osUtil.nextTick(function()
            //{
                this.render();
                this.show();
            //}.bind(this));
        }
	}


    Class.render = function ()
    {                
        Base.prototype.render.call(this);

        this.preGenHTML();
       
        this.genHTML();
       
        this.posGenHTML();
        
        if(this.asyncPosGenHTML)
        {
            var self = this;

            osUtil.nextTick(function(){self.asyncPosGenHTML();});
        }

        return this;
    }

    // generate view's dom tree
    Class.genHTML = function()
    {
        if(this._html)
        {
            this.setElement($(this._html), true);
        }
    }

    // do some work before dom tree construction  
    Class.preGenHTML = function()
    {

    }

    // called after genHTML(), do some work after the view's dom tree is done. 
    Class.posGenHTML = function()
    {

    }

	Class.remove = function()
	{
		Backbone.View.prototype.remove.call(this);

		this.onRemove();
	}

	Class.show = function()
	{
		if(this._show)
		{
			return ;
		}

		this._show = true;
		this.$().css("display", "block");
		this.onShow();
	}
	
	Class.hide = function()
	{
		if(this._show !== null && !this._show)
		{
			return ;
		}
		
		this._show = false;
		this.$().css("display", "none");
		this.onHide();
	}

	Class.isShow = function()
	{
		return this._show;
	}
	
	Class.onShow = function()
	{
		$(window).on('orientationchange', this.onOrientationchange);
		$(window).on('resize', this.onWindowResize);
		$(window).on('scroll', this.onWindowScroll);
	}

	Class.onHide = function()
	{
		$(window).off('orientationchange', this.onOrientationchange);
		$(window).off('resize', this.onWindowResize);
		$(window).off('scroll', this.onWindowScroll);
	}

	Class.onRemove = function()
	{

	}

	Class.onOrientationchange = function() 
	{

	}

	Class.onWindowScroll = function() {}

	Class.onWindowResize = function() {}

	Class.$ = function(sel, fromSel)
    {
        if(fromSel)
        {
            return this.$(fromSel).find(sel); 
        }
        else
        {
            return sel ? this.$el.find(sel) : this.$el;
        }
    }

    Class.$html = function(sel, html)
    {
        var ele = this.$(sel);

        if(html)
        {
            ele.html(html);
        }
        else
        {
            return ele.html();
        }
    }

    Class.$text = function(sel, text)
    {
        var ele = this.$(sel);

        if(text)
        {
            ele.text(text);
        }
        else
        {
            return ele.text();
        }
    }

    Class.$append = function(sel, elem)
    {
        this.$(sel).append(elem);
    }

    Class.$fragment = function(sel, fromSel)
    {
        var elem = this.$(sel, fromSel);
        return elem ? elemUtil.newFragment(elem) : null;
    }
	
	return Base.extend(Class);
});
