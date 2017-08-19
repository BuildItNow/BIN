define(["bin/core/util", "vue"], 
function(util, Vue)
{
    if(Vue)
    {
        var ViewModel = bin.extend.call(Vue, 
        {
            constructor:function()  // two-phase to create view-model
            {

            },
            b_init:function(view, options)
            {
                this._b_view = view;
                Vue.call(this, options);
            },
            b_release:function()
            {
                if(this._b_unLinks)
                {
                    for(var i=this._b_unLinks.length-1; i>=0; --i)
                    {
                        this._b_unLinks[i](true);
                    }

                    delete this._b_unLinks;
                }

                this.$destroy();
                this._b_view = null;
            },
            b_compile:function(elem)
            {
                if(elem.length === 0)
                {
                    return ;
                }

                if(!this._b_unLinks)
                {
                    this._b_unLinks = [];
                }

                var unlinks = [];
        
                for(var i=0,i_sz=elem.length; i<i_sz; ++i)
                {
                    unlinks.push(this.$compile(elem[i]));
                }

                var unlinker = function()
                {
                    if(!unlinks)
                    {
                        return ;
                    }

                    for(var i=0,i_sz=unlinks.length; i<i_sz; ++i)
                    {
                        unlinks[i].apply(this, arguments);
                    }

                    unlinks = null;
                }

                this._b_unLinks.push(unlinker);

                return unlinker;
            }
        });

        var camelizeRE = /-(\w)/g;
        function camelize(str) 
        {
            return str.replace(camelizeRE, toUpper);
        }

        function toUpper(_, c)
        {
            return c ? c.toUpperCase() : '';
        }

        Vue.elementDirective("view", 
        {
            priority:500,
            compileDirective:true,
            bind:function()
            {   
                var vm   = this.vm;
                var view = vm._b_view;
                var el   = this.el;
                var elCtn = el.children[0];
                var name = null;
                var path = null;
                    
                var opts = null;
                var otherOpts = {};
                var hide = false;
                var isAsync = false;

                // parse attrs
                var attrs = el.attributes;
                var attrName  = null;
                var attrVale  = null;
                for(var i=0,i_sz=attrs.length; i<i_sz; ++i)
                {
                    attrVale = attrs[i].value;
                    attrName = attrs[i].name;

                    if(attrName === "name")
                    {
                        name = attrVale;
                    }
                    else if(attrName === "path")
                    {
                        path = attrVale;
                    }
                    else if(attrName === "hide")
                    {
                        hide = true;
                    }
                    else if(attrName.startsWith("opts"))
                    {
                        if(attrName.length === 4)
                        {
                            opts = Vue.b_makeValueFunction(attrVale)(view, vm, el); 
                        }
                        else
                        {
                            var optsName = camelize(attrName.substring(5));
                            otherOpts[optsName] = Vue.b_makeValueFunction(attrVale)(view, vm, el); 
                        }
                    }
                    else if(attrName === "async")
                    {
                        isAsync = true;
                    }
                }

                var createView = function(ViewClass)
                {
                    if(this.b_unbinded)
                    {
                        return ;
                    }

                    var fragment     = null;
                    var fragmentElem = null;
                    var fragmentComp = false;

                    if(ViewClass.__html_plugin || bin.isString(ViewClass))
                    {
                        fragmentElem = $(ViewClass.__html_plugin ? ViewClass() : ViewClass);

                        if(fragmentElem.length === 0)
                        {
                            return ;
                        }

                        fragment = $(document.createDocumentFragment());
                        fragment.append(fragmentElem);

                        if(fragmentElem[0].getAttribute("vm") != null)
                        {
                            fragmentElem[0].removeAttribute("vm");

                            fragmentComp = true;
                        }
                    }
                    
                    var removeEl = false;
                    if(opts)
                    {
                        otherOpts = _.extend(opts, otherOpts);
                    }

                    if(otherOpts.elem)
                    {
                        removeEl = true;
                    }
                    else
                    {
                        otherOpts.elem = elCtn;
                    }

                    if(otherOpts.elemParent)
                    {
                        removeEl = true;
                        if(otherOpts.elemParent === "replace")  // just replace view element
                        {
                            otherOpts.elemParent = function(v)
                            {
                                el.parentNode && el.parentNode.replaceChild(fragment ? fragment[0] : v.$()[0], el);
                            }
                        }
                        else if(otherOpts.elemParent === "replace-parent") // just replace the parent of view
                        {
                            otherOpts.elemParent = function(v)
                            {
                                var elParent = el.parentNode;

                                elParent && elParent.parentNode && elParent.parentNode.replaceChild(fragment ? fragment[0] : v.$()[0], elParent);
                            }
                        }
                        else if(otherOpts.elemParent.startsWith("replace-element:")) // replace any element
                        {
                            var selector = otherOpts.elemParent.substring("replace-element:".length);
                            otherOpts.elemParent = function(v)
                            {
                                var elAny    = view.$(selector);

                                if(elAny && elAny.length > 0)
                                {
                                    elAny = elAny[0];
                                }

                                elAny && elAny.parentNode && elAny.parentNode.replaceChild(fragment ? fragment[0] : v.$()[0], elAny);
                            }
                        }
                    }

                    if(fragment)
                    {
                        if(otherOpts.elemParent)
                        {
                            if(bin.isFunction(otherOpts.elemParent))
                            {
                                otherOpts.elemParent();
                            }
                            else
                            {
                                otherOpts.elemParent.append(fragment);
                            }
                        }
                    }
                    else
                    {
                        var v = ViewClass.create(otherOpts);
                    }

                    if(removeEl)
                    {
                        el.parentNode && el.parentNode.removeChild(el);
                    }
                    else
                    {
                        el.parentNode && el.parentNode.replaceChild(fragment ? fragment[0] : v.$()[0], el);
                    }  

                    if(name && v)
                    {
                        if(view[name])
                        {
                            console.warn("页面注入名称冲突["+name+"]");
                        }

                        view[name] = v;
                    }

                    this.b_view = v;
                    this.b_name = name;

                    if(fragmentComp)
                    {
                        view.compile(fragmentElem);
                    }

                    if(v && hide)
                    {
                        v.hide();
                    }

                    if(view.onViewInject)
                    {
                        view.onViewInject(path, v || fragmentElem, name);
                    }
                }

                var self = this;
                var ViewClass = (view.__$class.deps && view.__$class.deps[path]) || bin.viewInjectGlobalDeps[path];
                if(!ViewClass)
                {
                    if(isAsync)
                    {
                        console.log(path);

                        require([path], function(ViewClass)
                        {
                            createView.call(self, ViewClass);
                        }, function()
                        {
                            console.error("加载页面类失败["+path+"], 页面注入失败");

                            el.parentNode.removeChild(el);
                        });
                    }
                    else
                    {
                        console.error("查找不到页面类["+path+"], 页面注入失败");

                        el.parentNode.removeChild(el);
                    }
                }
                else
                {
                    createView.call(this, ViewClass);
                }
            },
            unbind:function()
            {
                this.b_view && this.b_view.remove();
                this.b_name && (this.vm._b_view[this.b_name] = null);
                this.b_unbinded = true;
            }
        });

        bin.viewInjectGlobalDeps = {};

        var resolveViewInjectDependencies = function(el, cb, filter)
        {
            var viewEls = el.getElementsByTagName("view");
            if(!viewEls || viewEls.length === 0)
            {
                cb();
                return ;
            }

            var loading = {};
            var deps = bin.viewInjectGlobalDeps;
            var oldFilter = filter;
            filter = function(path)
            {
                if(loading[path] || deps[path])
                {
                    return true;
                }

                return oldFilter && oldFilter(path);
            }

            var loadTasks = [];
            var c = 0;

            var onLoadDone = function()
            {
                if(loadTasks.length === ++c)
                {
                    cb();
                }
            }

            var genLoadTask = function(viewEl, viewPath)
            {
                return function()
                {
                    require([viewPath], function(viewClass)
                    {   
                        deps[viewPath] = viewClass;

                        onLoadDone();
                    }, function()
                    {
                        onLoadDone();
                    });
                }
            }

            var viewEl   = null;
            var viewPath = null;
            var isAsync  = false;
            for(var i=0,i_sz=viewEls.length; i<i_sz; ++i)
            {   
                viewEl = viewEls[i];
                viewEl.style.display = "none";  
                viewPath = viewEl.getAttribute("path");

                isAsync = viewEl.getAttribute("async") != null;

                if(viewPath && viewPath.indexOf("{") < 0)   // not vue bind
                {
                    if(!isAsync && !filter(viewPath))
                    {
                        loading[viewPath] = true;

                        loadTasks.push(genLoadTask(viewEl, viewPath));
                    }
                }
                else// maybe vue runtime bind {{}} or :path
                {
                    viewEl.setAttribute("async", "");   
                }
            }

            if(loadTasks.length > 0)
            {
                for(var i=0,i_sz=loadTasks.length; i<i_sz; ++i)
                {   
                    loadTasks[i]();
                }
            }
            else
            {
                cb();
            }
        }

        bin.resolveViewInjectDependencies = resolveViewInjectDependencies;
    }

    var Base = Backbone.View;
    var View = undefined;

    var Class =  
    {
    };

    Class.constructor = function(options)
    {
        this._show  = null;
        this._elemParent = options ? options.elemParent : null;
        
        if(options && options.el)   // Load by BIN, BIN will auto set element by html content
        {
            this._html = null;
            
            Base.call(this, options);

            if(!options.manualRender)
            {
                this.render();
                this.show();
            }

            return ;
        }

        if(options && options.elem)       // Init from a element
        {
            options.el = options.elem;
            options.elem = null;

            Base.call(this, options);

            if(!options.manualRender)
            {
                this.render();
                this.show();
            }
            
            return ;
        }

        this._html = options && options.html ? options.html : this.__$class.html;

        Base.call(this, options);

        if(this._html || !options || !options.manualRender)
        {
            this.render();
            this.show();
        }
    }

    var methodWrapper = function(self, impl)
    {
        return function()
        {
            return impl.apply(self, arguments);
        }
    }

    Class.render = function ()
    {             
        var self = this;  

        Base.prototype.render.call(this);

        this.preGenHTML();
       
        this.genHTML();

        if(this._elemParent)
        {
            if(typeof this._elemParent === "function")
            {
                this._elemParent(this);
            }
            else
            {
                $(this._elemParent).append(this.$());
            }

            this._elemParent = undefined;
            delete this._elemParent;
        }

        if(Vue)
        {
            var VMOptions = undefined;
            if(this.__$class.VMOptions)
            {
                VMOptions = util.clone(this.__$class.VMOptions, true);

                // Fix vm functions
                var methods = VMOptions.methods;
                for(var key in methods)
                {
                    methods[key] = methodWrapper(self, methods[key]);
                }

                var computed = VMOptions.computed;
                for(var key in computed)
                {
                    if(typeof computed[key] === "function")
                    {
                        computed[key] = methodWrapper(self, computed[key]);
                    }
                    else
                    {
                        if(computed[key].set)
                        {
                            computed[key].set = methodWrapper(self, computed[key].set);
                        }

                        if(computed[key].get)
                        {
                            computed[key].get = methodWrapper(self, computed[key].get);
                        }
                    }
                }

                var watch = VMOptions.watch;
                for(var key in watch)
                {
                    if(typeof watch[key] === "function")
                    {
                        watch[key] = methodWrapper(self, watch[key]);
                    }
                    else
                    {
                        watch[key].handler = methodWrapper(self, watch[key].handler);
                    }
                }
            }
            else if(this.$()[0].getAttribute("vm") !== null)
            {
                VMOptions = {};
            }

            if(this.prepareVMOptions)
            {
                VMOptions = this.prepareVMOptions(VMOptions);
            }

            if(VMOptions)
            {
                if(this.hasOwnProperty("vmData"))
                {
                    VMOptions.data = _.extend(VMOptions.data || {}, this.vmData);
                }

                var el = this.$()[0];
                if(el)
                {
                    if(!el.__v_pre__)
                    {
                        el.nodeType === 1 && el.removeAttribute("v-pre");
                        el.__v_pre__ = true;
                    }

                    VMOptions.el = this.$()[0];
                }
                
                this.vm = new ViewModel();
                this.vm.b_init(this, VMOptions);
            }
        }
           
        this.posGenHTML();

        var elemContent = this.$content();
        if(elemContent.hasClass("bin-lazyload-container"))
        {
            this.lazyLoadContainer(elemContent);

            if(this.vm && !elemContent.hasClass("bin-no-vm-flush"))
            {
                this.vm.$on("flush", function()
                {
                    self.lazyLoadContainer(elemContent);
                });
            }
        }

        if(this.vm && this.onViewModelFlush)
        {
            this.vm.$on("flush", function()
            {
                self.onViewModelFlush();
            });
        }


        if(this.asyncPosGenHTML)
        {
            setTimeout(function(){self.asyncPosGenHTML();}, 0);
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
        Base.prototype.remove.call(this);

        if(this._llViews && this._llViews.length > 0)
        {
            for(var i=0,i_sz=this._llViews.length; i<i_sz; ++i)
            {
                this._llViews[i].remove();
            }

            delete this._llViews;
        }

        if(this.vm)
        {
            this.vm.b_release();
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

    // Only handle jquery elements
    Class.compile = function(elem)
    {
        if(!this.vm)
        {
            console.warm("ViewModel not created for this view, can't compile the element");
            return ;
        }

        return this.vm.b_compile(elem);
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

    Class.$content = function()
    {
        return this.$();
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
        return elem ? util.newFragment(elem) : null;
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

        var elemContainer = this._llContainer;

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
            setTimeout(function()
            {
                elemContainer.unbind("scroll", this._llOnScrollListener);
                this._llOnScrollListener = null;
            }, 0);
        }
    }

    Class._llTryLazyLoad = function()
    {
        if(!this._llViews || this._llViews.length === 0)
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

    Class.lazyLoadContainer = function(container)
    {
        this._llContainer = container || this.$content();
        var self = this;
        require(["bin/common/lazyLoadView"], function(LazyLoadView)
        {
            var elemContainer = self._llContainer;

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

                setTimeout(function()
                {
                    self.tryLazyLoad();
                }, 0);
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

    View = Base.extend(Class, 
    {
        create:function(options)
        {
            return new this(options);
        }
    });

    if(Vue)
    {
        var extend = View.extend;
        View.extend = function(cls, sta)
        {
            // Generate View-Model options
            var VMOptions = util.clone(this.VMOptions, true) || {};

            if(!VMOptions.data)
            {
                VMOptions.data = {};
            }

            if(!VMOptions.computed)
            {
                VMOptions.computed = {};
            }

            if(!VMOptions.watch)
            {
                VMOptions.watch = {};
            }

            if(!VMOptions.methods)
            {
                VMOptions.methods = {};
            }

            if(!VMOptions.filters)
            {
                VMOptions.filters = {};
            }

            var hasVM = false;

            if(cls.vmData)
            {
                VMOptions.data = _.extend(VMOptions.data, cls.vmData);
                hasVM = true;
            }

            for(var key in cls)
            {
                if(key.indexOf("vm") !== 0)
                {
                    continue;
                }

                if(key.indexOf("Method_", 2) === 2)
                {
                    VMOptions.methods[key.substring(9)] = cls[key];
                    hasVM = true;
                }
                else if(key.indexOf("Computed_", 2) === 2)
                {
                    VMOptions.computed[key.substring(11)] = cls[key];
                    hasVM = true;
                }
                else if(key.indexOf("Watch_", 2) === 2)
                {
                    VMOptions.watch[key.substring(8)] = cls[key];
                    hasVM = true;
                }
                else if(key.indexOf("Filter_", 2) === 2)
                {
                    VMOptions.filters[key.substring(9)] = cls[key];
                    hasVM = true;
                }
            }

            hasVM = hasVM || this.VMOptions;

            var ret = extend.apply(this, arguments);

            if(hasVM)
            {
                ret.VMOptions = VMOptions;
            }

            return ret;
        }
    }

    return View;
});
