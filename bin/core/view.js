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
		this._isShow  = false;
		this._root    = null;
		
		if(options && options._autoLoad)   // Load by BIN, BIN will auto set element by html content
        {
            this._html = null;
            
            Backbone.View.apply(this, arguments);

            return ;
        }

        this._html = options ? options.html : this.html;

       	Backbone.View.apply(this, arguments);

        if(this._html)
        {
            this.render();
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
            // Assert there is a root node in html
            this._root = $(this._html);
            this.el = this._root[0];
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

    Class.addView = function(sel, view)
    {
        var node = this.getElement(sel);
        if(node)
        {
            node.append(view.getRoot());
            view.show();
        }
    }

    Class.insertViewBefore = function(sel, view)
    {
        var node = view.getRoot();
        var beforeNode = this.getElement(sel);
        if(beforeNode)
        {
            node.insertBefore(beforeNode);
            view.show();
        }
    }

	Class.remove = function()
	{
		Backbone.View.prototype.remove.call(this);

		this.onRemove();
	}

	Class.show = function()
	{
		if(this.isShow())
		{
			return ;
		}

		this._isShow = true;
		this.getRoot().css("display", "block");
		this.onShow();
	}
	
	Class.hide = function()
	{
		if(!this.isShow())
		{
			return ;
		}
		
		this._isShow = false;
		this.getRoot().css("display", "none");
		this.onHide();
	}

	Class.isShow = function()
	{
		return this._isShow;
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
		this.$('input').blur();
	}

	Class.onWindowScroll = function() {}

	Class.onWindowResize = function() {}

	Class.getRoot = function()
    {
        if(!this._root)
        {
            this._root = $(this.el);
        }

        return this._root;
    }

    Class.getElement = function(sel, fromSel)
    {
        if(!sel && !fromSel)
        {
            return this.getRoot();
        }

        var from = this.getElement(fromSel);
        if(sel)
        {
            return from.find(sel);
        }
        else
        {
            return from;
        }
    }

    Class.elementHTML = function(sel, html)
    {
        var ele = this.getElement(sel);

        if(html)
        {
            ele.html(html);
        }
        else
        {
            return ele.html();
        }
    }

    Class.elementFragment = function(sel, fromSel)
    {
        var elem = this.getElement(sel, fromSel);
        return elem ? elemUtil.newFragment(elem) : null;
    }
	
	return Base.extend(Class);
});
