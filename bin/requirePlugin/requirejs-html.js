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
                    var cld = el.children;
                    var ret = [];
                    for(var i=0,i_sz=cld.length; i<i_sz; ++i)
                    {
                        ret.push(cld[i]);
                    }
                    el = null;

                    return ret;
                }

                factory.html = html;
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
