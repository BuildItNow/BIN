define([], function () 
{
    var toLeftSlash = function(path)
    {
        return path.replace(/\\/g, '/');
    }

    var loadFromNative = function(ViewClass, require, name, success, fail)
    {
        var el = document.createElement('div');
        el.innerHTML = "<div id='"+name+"' class='bin-native-page'></div>";
        el = el.firstElementChild;

        ViewClass = ViewClass.extend({});
            
        ViewClass.create = function(options)
        {
            options = options || {};
            options.el = el.cloneNode(true);

            return new ViewClass(options);
        }

        success(ViewClass);
    }

    var loadViewDependencies = function(el, cb)
    {
        var viewEls = el.getElementsByTagName("view");
        if(!viewEls || viewEls.length === 0)
        {
            cb();
            return ;
        }

        var deps = {};
        var c = 0;
        var s = false;

        var onLoadViewDone = function(error, viewEl, viewPath, viewClass)
        {
            if(!error)
            {
                s = true;
                deps[viewPath] = viewClass;
            }

            if(viewEls.length === ++c)
            {
                cb(s ? deps : null);
            }
        }

        var genLoadTask = function(viewEl, viewPath)
        {
            return function()
            {
                require([viewPath], function(viewClass)
                {   
                    onLoadViewDone(false, viewEl, viewPath, viewClass);
                }, function()
                {
                    onLoadViewDone(true, viewEl, viewPath);
                });
            }
        }

        var loadTasks = [];

        var viewEl   = null;
        var viewPath = null;
        for(var i=0,i_sz=viewEls.length; i<i_sz; ++i)
        {   
            viewEl = viewEls[i];
            viewEl.style.display = "none";  
            viewPath = viewEl.getAttribute("path");
            if(viewEl.getAttribute("async") == null && viewPath && viewPath.indexOf("{") < 0)   // not vue bind
            {
                loadTasks.push(genLoadTask(viewEl, viewPath));
            }
            else // maybe vue runtime bind {{}} or :path
            {
                onLoadViewDone(true, viewEl, viewPath);
            }
        }

        if(loadTasks.length > 0)
        {
            for(var i=0,i_sz=loadTasks.length; i<i_sz; ++i)
            {   
                loadTasks[i]();
            }
        }
    }

    var loadFromHtml = function(ViewClass, html, require, name, success, fail)
    {
        var el = document.createElement('div');
        el.innerHTML = html;
        if(el.childElementCount != 1)
        {
            var error = requirejs.makeError("binerror_multiplerootnode", "view只能拥有一个根节点,而["+name+".html]中却包含多个根节点", null, name);
            fail(error);

            return ;
        }
        el = el.firstElementChild;

        loadViewDependencies(el, function(deps)
        {

            // Spawn a new class, avoid change the source class create method
            ViewClass = ViewClass.extend({});

            if(deps)
            {
                ViewClass.deps = ViewClass.deps ? _.extend(deps, ViewClass.deps) : deps;
            }
                
            var oldCreate = ViewClass.create;
            ViewClass.create = function(options)
            {
                options = options || {};

                if(!options.html && !options.elem)
                {
                    options.el = el.cloneNode(true);
                }

                return oldCreate ? oldCreate.call(this, options) : new this(options);
            }

            var cssName = el.getAttribute('data-css') || ViewClass.style;
            if(cssName === '$')
            {
                cssName = name+".css";
            }
           
            if(!cssName)
            {
                success(ViewClass);

                return ;
            }

            require(["css!"+toLeftSlash(cssName)], function()
            {
                success(ViewClass);
            }, fail);
        });
    }

    var loadViewClass = function(require, name, success, fail)
    {
        require([name], function(ViewClass)
        {
            // Native
            if(ViewClass.native)
            {
                loadFromNative(ViewClass, require, name, success, fail);

                return ;
            }

            // Class html
            // if(ViewClass.html)
            // {
            //     loadFromHtml(ViewClass, ViewClass.html, require, name, success, fail);

            //     return ;
            // }

            // From view html
            var view = ViewClass.view || name+".html";

            require(['text!'+view], function(html)
            {
                if(!html)
                {
                    success(ViewClass);

                    return ;
                }
                
                loadFromHtml(ViewClass, html, require, name, success, fail);
            },function()
            {
                success(ViewClass);
            });
            
        }, fail);
    }

    var plugin = 
    {
        load:function(name, req, onLoad, config)
        {
            name = toLeftSlash(name);

            loadViewClass(req, name, 
                function(ViewClass)
                {
                    onLoad(ViewClass);
                }, 
                function(err)
                {
                    onLoad.error(err);
                }
            );
        },
        resolveViewInjectionDependencies:function(el, cb)
        {
            return loadViewDependencies(el, cb);
        }
    }

    return plugin;
});
