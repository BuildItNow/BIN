define(["bin/util/pathUtil"], function (pathUtil) 
{
    'use strict';
    var loadViewClassByElement = function(require, name, el, success, fail)
    {
        var viewName = el.getAttribute('data-view');
        if(!viewName || viewName == '')
        {
            viewName = name;
        }

        viewName = pathUtil.toLeftSlash(viewName);
        
        require([viewName], function(View)
        {
            var elemPrototype = el;
            var Class = View.extend(
            {
                constructor: function()
                {
                    this.el  = elemPrototype.cloneNode(true);
                    View.apply(this, arguments);
                }
            });

            success(Class);
        }, fail);
    }

     var loadViewClassByHTML = function(require, name, source, success, fail)
    {
        var el = document.createElement('div');
        el.innerHTML = source;
        if(el.childElementCount != 1)
        {
            fail();
            return ;
        }

        el = el.firstElementChild;

        loadViewClassByElement(require, name, el, success, fail);
    }

    var loadViewClassByName = function(require, name, success, fail)
    {
        require(['text!'+name+'.html'], function(htmlSource)
        {
            loadViewClassByHTML(require, name, htmlSource, success, fail);
        });
    }

    var plugin = 
    {
        load:function(name, req, onLoad, config)
        {
            loadViewClassByName(req, name, 
                function(View)
                {
                    onLoad(View);
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
