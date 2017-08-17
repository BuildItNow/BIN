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

        // Spawn a new class, avoid change the source class create method
        ViewClass = ViewClass.extend({});

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

        if(bin.resolveViewInjectDependencies)
        {
            var oldSuccess = success;
            success = function(ViewClass)
            {
                bin.viewInjectGlobalDeps["view!"+name] = ViewClass;
                bin.resolveViewInjectDependencies(el, function()
                {
                    oldSuccess(ViewClass);
                });
            }
        }

        var cssName = ViewClass.style;
        if(!cssName)
        {
            success(ViewClass);

            return ;
        }

        require(["css!"+toLeftSlash(cssName)], function()
        {
            success(ViewClass);
        }, fail);
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
