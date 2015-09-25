define(["bin/util/elemUtil", "bin/util/osUtil"], 
function(elemUtil, osUtil)
{
    var Base = Backbone.View;
    var View = undefined;
    var Class =  
    {
        html:null
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

        this._html = options && options.html ? options.html : this.html;

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

    Class.lazyLoadContainer = function()
    {
         View.lazyLoadContainer(this.$());
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

    View = Base.extend(Class);

    var onScroll = function(e)
    {
        e.currentTarget.tryLazyLoad();
    }

    View.lazyLoadContainer = function(elemContainer)
    {
        require(["bin/core/lazyLoadView"], function(LazyLoadView)
        {
            var el = elemContainer[0];
            
            if(!el.tryLazyLoad)
            {
                el._llDirty = false;
                el._llViews = undefined;
                el._update = function()
                {
                    console.log("Update");
                    
                    this._llDirty = false;

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
                            console.log("Lazy Load Done");
                            elemContainer.unbind("scroll", onScroll);
                        });
                    }
                }

                el.tryLazyLoad = function()
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

                    var self = this;
                    osUtil.delayCall(function()
                    {
                        self._update();
                    }, 500);
                }
            }

            var elems = elemContainer.find(".bin-lazyload");
            var elem  = undefined;
            var views = el._llViews = [];
            for(var i=0,i_sz=elems.length; i<i_sz; ++i)
            {
                elem = $(elems[i]);
                if(elem.data("loaded"))
                {
                    continue;
                }

                views.push(new LazyLoadView({elem:elem}));
            }

            if(views.length > 0)
            {
                elemContainer.unbind("scroll", onScroll);
                elemContainer.scroll(onScroll);

                osUtil.nextTick(function()
                {
                    el._update();
                });
            }
        });
    }

    return View;
});
