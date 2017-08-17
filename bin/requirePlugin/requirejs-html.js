define([], function () 
{
    var toLeftSlash = function(path)
    {
        return path.replace(/\\/g, '/');
    }

    var plugin = 
    {
        load:function(name, req, onLoad, config)
        {
            name = toLeftSlash(name);

            if(!name.endsWith(".html"))
            {
                name += ".html";
            }

            req(["text!"+name], function(html)
            {
                var el = document.createElement("div");
                el.innerHTML = html;

                var factory = function()
                {
                    if(!el)
                    {
                        var el = document.createElement("div");
                        el.innerHTML = html;
                    }

                    var ret = el.children;
                    el = null;

                    return ret;
                }

                factory.__html_plugin = true;

                if(el.firstElementChild && el.firstElementChild.getAttribute("vm") != null)
                {
                    bin.resolveViewInjectDependencies(el, function()
                    {
                        onLoad(factory);
                    });
                }
                else
                {
                    onLoad(factory);
                }
            }, function(err)
            {
                onLoad.error(err);
            });
        }
    }

    return plugin;
});
