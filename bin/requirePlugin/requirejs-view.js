define(["bin/util/pathUtil"], function (pathUtil) 
{
    var loadFromNative = function(ViewClass, require, name, success, fail)
    {
        var el = document.createElement('div');
        el.innerHTML = "<div id='"+name+"' class='bin-native-page'></div>";
        el = el.firstElementChild;
            
        ViewClass.create = function()
        {
            return new ViewClass({el:el.cloneNode(true)});
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
            
        ViewClass.create = function()
        {
            return new ViewClass({el:el.cloneNode(true)});
        }

        var cssName = el.getAttribute('data-css');
        if(cssName == '$')
        {
            cssName = name;
        }

        if(!cssName)
        {
            success(ViewClass);

            return ;
        }

        require(["css!"+pathUtil.toLeftSlash(cssName)+".css"], function()
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
            if(ViewClass.html)
            {
                loadFromHtml(ViewClass, ViewClass.html, require, name, success, fail);

                return ;
            }

            // From view html
            var view = ViewClass.view || name+".html";

            require(['text!'+view], function(html)
            {
                loadFromHtml(ViewClass, html, require, name, success, fail);
            }, fail);
            
        }, fail);
    }

    var plugin = 
    {
        load:function(name, req, onLoad, config)
        {
            name = pathUtil.toLeftSlash(name);

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
