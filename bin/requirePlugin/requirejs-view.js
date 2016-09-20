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
            fail();
            return ;
        }
        el = el.firstElementChild;

        // Spawn a new class, avoid change the source class create method
        ViewClass = ViewClass.extend({});
            
        var oldCreate = ViewClass.create;
        ViewClass.create = function(options)
        {
            options = options || {};
            if(options.autoRender === undefined && this.autoRender)
            {
                options.autoRender = this.autoRender;
            }

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
        }
    }

    return plugin;
});
