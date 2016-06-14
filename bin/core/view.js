define(["bin/util/elemUtil", "bin/util/osUtil"], 
function(elemUtil, osUtil)
{
    var Base = Backbone.View;
    var View = undefined;

    // Static Properties
    //__$html:null, // View from class html string
    //__$view:null, // View from html file
    //__$native:{ios:null, android:null},  // View from native

    var Class =  
    {
    };

    Class.constructor = function(options)
    {
        this._show  = null;
        
        if(options && options.el)   // Load by BIN, BIN will auto set element by html content
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


            this.render();
            this.show();
            
            return ;
        }

        this._html = options && options.html ? options.html : this.__$class.html;

        Backbone.View.call(this, options);

        if(this._html)
        {
            this.render();
            this.show();
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
        if(this.$().hasClass("bin-lazyload-container"))
        {
            this.lazyLoadContainer();
        }
    }

    Class.remove = function()
    {
        Backbone.View.prototype.remove.call(this);

        if(this._llViews && this._llViews.length > 0)
        {
            for(var i=0,i_sz=this._llViews.length; i<i_sz; ++i)
            {
                this._llViews[i].remove();
            }

            delete this._llViews;
        }

        this.onRemove();
    }

    Class.show = function()
    {
        if(this._show)
        {
            return ;
        }

        this._show = true;
        this.$().show();
        this.onShow();
    }
    
    Class.hide = function()
    {
        if(this._show !== null && !this._show)
        {
            return ;
        }
        
        this._show = false;
        this.$().hide();
        this.onHide();
    }

    Class.isShow = function()
    {
        return this._show;
    }
    
    Class.onShow = function()
    {

    }

    Class.onHide = function()
    {

    }

    Class.onRemove = function()
    {

    }

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

        if(html !== null && html !== undefined)
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

    Class.$content = function()
    {
        return this.$(".bin-page-content");
    }


    // Lazy load feature

    // Lazy load queue for image, avoid load too much image in a short time
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
            loadingTimer = setInterval(loadTimer, 200);
        }
    }

    var LL_WAITTING_TIME  = 200;
    var LL_CHECKING_TIME  = LL_WAITTING_TIME*0.8;            

    Class._llOnScroll = function()
    {
        if(this._llTimeout)
        {
            if((_.now()-this._llTime) < LL_CHECKING_TIME)
            {
                return ;
            }

            clearTimeout(this._llTimeout);
        }


        var self = this;
        this._llTime    = _.now();  
        this._llTimeout = setTimeout(function()
        {
            self._llTimeout = null;
            self._llTime = 0;
            self._llTryLazyLoad();

        }, LL_WAITTING_TIME);
    }

    Class._llUpdate = function()
    {
        this._llDirty = false;

        var elemContainer = this.$();

        var os = elemContainer.offset();
        var vl = os.left;
        var vt = os.top;
        var vr = vl+elemContainer.width();
        var vb = vt+elemContainer.height();
        var views = this._llViews;
        var i = 0;
        var i_sz = views.length;
        for(; i<i_sz;)
        {
            if(views[i].update(vt, vr, vb, vl))
            {
                this.onViewLazyLoad(views[i]);

                --i_sz;
                views[i] = views[i_sz];
                views.pop();
            }
            else
            {
                ++i;
            }
        }

        if(views.length === 0)
        {
            osUtil.nextTick(function()
            {
                elemContainer.unbind("scroll", this._llOnScrollListener);
                this._llOnScrollListener = null;
            });
        }
    }

    Class._llTryLazyLoad = function()
    {
        if(this._llViews.length === 0)
        {
            return ;
        }

        if(this._llDirty)
        {    
            return ;
        }

        this._llDirty = true;

        this._llUpdate();
    }

    Class.tryLazyLoad = function()
    {
        this._llTryLazyLoad();
    }

    Class.lazyLoadContainer = function()
    {
        var self = this;
        require(["bin/common/lazyLoadView"], function(LazyLoadView)
        {
            var elemContainer = self.$();

            if(!self._llOnScrollListener)
            {
                self._llOnScrollListener = function()
                {
                    self._llOnScroll();
                }
            }

            if(self._llTimeout)
            {
                clearTimeout(self._llTimeout);
            }

            if(self._llViews && self._llViews.length > 0)
            {
                for(var i=0,i_sz=self._llViews.length; i<i_sz; ++i)
                {
                    self._llViews[i].remove();
                }
            }

            elemContainer.unbind("scroll", self._llOnScrollListener);

            self._llTimeout = null;
            self._llTime    = null;

            var elems = elemContainer.find(".bin-lazyload");
            var elem  = undefined;
            var views = self._llViews = [];
            for(var i=0,i_sz=elems.length; i<i_sz; ++i)
            {
                elem = elems[i];
                if(elem.getAttribute("data-loaded") || elem.getAttribute("data-bin-loaded"))
                {
                    continue;
                }
            
                views.push(new LazyLoadView({elem:elem}));
            }

            if(views.length > 0)
            {
                elemContainer.scroll(self._llOnScrollListener);

                osUtil.nextTick(function()
                {
                    self.tryLazyLoad();
                });
            }
        });
    }

    Class.onViewLazyLoad = function(view)
    {
        if(view.type() === "image")
        {
            var image = view.$().data("bin-image") || view.$().data("image");
            view._image = image;
            loadLazyImage(view);
        }
    }

    View = Base.extend(Class);

    return View;
});
