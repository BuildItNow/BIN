define(
["vue"], 
function(Vue)
{
    if(!Vue)
    {
        return ;
    }

    var camelizeRE = /-(\w)/g;
    function camelize(str) 
    {
        return str.replace(camelizeRE, toUpper);
    }

    function toUpper(_, c)
    {
        return c ? c.toUpperCase() : '';
    }

    Vue.elementDirective("route", {
        priority: 500,
        compileDirective: true,
        bind:function()
        {
            var vm   = this.vm;
            var view = vm._b_view;
            var el   = this.el;

            var viewPath  = null;
            var createModel = "normal";
            var silent    = false;

            var opts = null;
            var otherOpts = {};
            
            // parse attrs
            var attrs = el.attributes;
            var attrName  = null;
            var attrVale  = null;
            for(var i=0,i_sz=attrs.length; i<i_sz; ++i)
            {
                attrVale = attrs[i].value;
                attrName = attrs[i].name;

                if(attrName === "view")
                {
                    viewPath = attrVale;
                }
                else if(attrName === "createmodel")
                {
                    createModel = attrVale;
                }
                else if(attrName === "silent")
                {
                    silent = true;
                }
                else if(attrName.startsWith("opts"))
                {
                    if(attrName.length === 4)
                    {
                        opts = Vue.b_makeValueFunction(attrVale); 
                    }
                    else
                    {
                        var optsName = camelize(attrName.substring(5));
                        otherOpts[optsName] = Vue.b_makeValueFunction(attrVale); 
                    }
                }
            }

            var viewOptions = function()
            {
                var o = opts && opts(view, vm, el);
                var oo = {};

                for(var k in otherOpts)
                {
                    oo[k] = otherOpts[k](view, vm, el);
                }

                if(o)
                {
                    oo = _.extend(o, oo);
                }

                return oo;
            }

            var pathEls = [];
            var subPathEls = el.getElementsByTagName("path");
            if(subPathEls && subPathEls.length > 0)
            {
                for(var i=0,i_sz=subPathEls.length; i<i_sz; ++i)
                {
                    pathEls.push(subPathEls[i]);
                }
            }

            pathEls.push(el);

            var paths = [];
            for(var i=0,i_sz=pathEls.length; i<i_sz; ++i)
            {
                var path = pathEls[i].getAttribute("path");

                if(path === null)
                {
                    break;
                }

                if(path.startsWith("regex:"))
                {
                    path = path.substring(6);
                    if(path.charAt(0) !== "^")
                    {
                        path = "^"+path;
                    }
                    if(path.charAt(path.length-1) !== "$")
                    {
                        path += "$";
                    }
                }
                else if(path === "#" || path === "")
                {
                    path = "^$";
                }
                else
                {
                    var optionalParam = /\((.*?)\)/g;
                    var namedParam    = /(\(\?)?:\w+/g;
                    var splatParam    = /\*\w+/g;
                    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

                    path = path.replace(escapeRegExp, "\\$&")
                                .replace(optionalParam, "(?:$1)?")
                                .replace(namedParam, function(match, optional) 
                                {
                                    return optional ? match : "([^/?]+)";
                                })
                                .replace(splatParam, "([^?]*?)");

                    path = "^"+path;
                    path += "$";
                }

                path = {regex: new RegExp(path)};

                var mock = pathEls[i].getAttribute("mock");

                if(mock)
                {
                    path.mock = mock;
                }

                paths.push(path);
            }

            el.innerHTML = "";

            this._route = new Route({el:el, paths:paths, viewPath:viewPath, createModel:createModel, silent:silent}, viewOptions);
            this._route.init();
        },
        unbind:function()
        {
            if(this._route)
            {
                this._route.release();
                this._route = null;
            }
        }
    });

    var Route = function(options, viewOptions)
    {
        this._options = options;
        this._path  = options.paths.length === 1 ? options.paths[0] : null;
        this._paths = options.paths;

        this._viewOptions = viewOptions;
    }

    Route.extend = bin.extend;

    var pro = Route.prototype;

    pro.init = function()
    {   
        bin.router.addRoute(this);
        this.inited = true;

        if(!this._options.silent)
        {
            var func = this.onRoute(bin.router.getRoutePath());
            func && func();
        }
    }

    pro.release = function()
    {
        bin.router.remRoute(this);

        if(this._view)
        {
            this._view.remove();
            this._view = null;
        }

        this._options = null;
        this._viewOptions = null;

        this.inited = false;
    }

    pro.onRoute = function(path)
    {
        var match = this.execMatch(path);

        if(!this._match && !match)
        {
            return ;
        }

        var self = this;
        var ret = function()
        {
            if(!self.inited)
            {
                return ;
            }

            var newMatch = !!match;

            newMatch ? self.onMatch(match.slice(1)) : self.onUnmatch();

            self._match = newMatch;
        }

        ret.match = !!match;

        return ret;
    }

    pro.execMatch = function(path)
    {
        var match = null;
        if(this._path)
        {
            match = this._path.regex.exec(path);
            if(match && this._path.mock)
            {
                bin.router.mock(this._path.mock, null, true);
            }

            return match;
        }

        var newMatch = null;
        var paths = this._paths;
        for(var i=0,i_sz=paths.length; i<i_sz; ++i)
        {
            var p = paths[i];
            newMatch = p.regex.exec(path);
            if(newMatch)
            {
                if(p.mock)
                {
                    bin.router.mock(p.mock, null, true);
                    path = p.mock;

                    match = newMatch;
                }
                else
                {
                    return newMatch;
                }
            }
        }

        return match;
    }

    pro.onMatch = function(matches)
    {
        this._matchContext = matches;

        if(this._requireing)
        {
            return ;
        }

        var oldMatch = this._match;

        var self = this;
        var onViewRoute = function()
        {
            var matches     = self._matchContext;

            var args = [];
            args.push(oldMatch);
            args.push(true);
            for(var i=0,i_sz=matches.length; i<i_sz; ++i)
            {
                args.push(matches[i]);
            }

            var viewHandled = false;

            if(self._view.onRoute)
            {
                viewHandled = self._view.onRoute.apply(self._view, args);
            }

            if(!viewHandled)
            {
                self._view.show();
            }
        }

        var oldView = null;
        if(this._options.createModel === "always")
        {
            oldView = this._view;
            this._view = null;
        }

        if(!this._view)
        {
            this._requireing = true;

            require([this._options.viewPath], function(ViewClass)
            {
                self._requireing = false;

                if(oldView)
                {
                    oldView.remove();
                    oldView = null;
                }

                // Double check
                if(!self._match)
                {
                    return ;
                }

                var options = self._viewOptions();

                self._view = ViewClass.create(options);

                if(!options.elemParent)
                {
                    self._options.el.appendChild(self._view.$()[0]);
                }

                onViewRoute();
            }, function()
            {
                self._requireing = false;
            });
        }
        else
        {
            onViewRoute();
        }
    }

    pro.onUnmatch = function()
    {
        if(!this._view)
        {
            return ;
        }

        if(this._options.createModel === "never")
        {
            var viewHandled = false;
            if(this._view.onRoute)
            {
                viewHandled = this._view.onRoute(this._match, false);
            }

            if(viewHandled)
            {
               return ; 
            }

            this._view.hide();
        }
        else
        {
            this._view.remove();
            this._view = null;
        }
    }

    Vue.directive("route", {
        priority:700,
        bind:function()
        {
            var el = this.el;
            var arg  = this.arg || "push";
            var data = undefined;
            var func = undefined;
            var path = undefined;
            if(arg === "push")
            {
                path = this.expression || el.getAttribute("pushPath");
                data = el.getAttribute("pushData");
                func = "push";

                if(path === "#")
                {
                    path = "";
                }
            }
            else if(arg === "pop")
            {
                path = this.expression;
                func = "pop";
                if(path)
                {
                    path = parseInt(view);
                }
                else
                {
                    path = 1;
                }
            }
            
            if(data)
            {
                data = Vue.b_makeValueFunction(data);
            }

            var self = this;

            if(bin.isNU(el.getAttribute("noClick")))
            {
                this.handler = function()
                {
                    bin.router[func](path, data && typeof data === "function" ? data(self.vm._b_view, self.vm, el) : data);
                }

                el.addEventListener("click", this.handler);
            }

            if(arg === "pop")
            {
                return ;
            }

            this._onRouteChange = function(path)
            {
                self.onRouteChange(path);
            }

            bin.router.on("ROUTE-CHANGE", this._onRouteChange);

            // Setup route checking
            this._activeRegex = el.getAttribute("activeRegex") || path;

            if(this._activeRegex && this._activeRegex.lastIndexOf("?") < 0)
            {
                this._activeRegex += this._activeRegex.endsWith("/") ? ".*" : "(/.*)*";
            }

            this._activeRegex = new RegExp("^"+this._activeRegex+".*$");

            var activeStyle   = el.getAttribute("activeStyle");
            var deactiveStyle = el.getAttribute("deactiveStyle");

            if(activeStyle)
            {
                activeStyle = Vue.b_makeValueFunction(activeStyle)(self.vm._b_view, self.vm, el);
            }

            if(deactiveStyle)
            {
                deactiveStyle = Vue.b_makeValueFunction(activeStyle)(self.vm._b_view, self.vm, el);
            }

            this._activeStyle   = activeStyle;
            this._deactiveStyle = deactiveStyle;

            if(bin.isNU(el.getAttribute("silent")))
            {
                this.onRouteChange(bin.router.getRoutePath());
            }

        },
        unbind:function()
        {
            if(this._onRouteChange)
            {
                bin.router.off("ROUTE-CHANGE", this._onRouteChange);
                this._onRouteChange = null;
            }

            if(this.handler)
            {
                this.el.removeEventListener("click", this.handler);
                this.handler = null;
            }
        },
        onRouteChange: function(path)
        {
            var oldMatch = this._match;

            var match = !!this._activeRegex.exec(path);

            if(match !== oldMatch)
            {
                var elem = $(this.el);
                if(match)
                {
                    if(bin.isString(this._deactiveStyle))
                    {
                        elem.removeClass(this._deactiveStyle);
                    }

                    if(!this._activeStyle)
                    {

                    }
                    else if(bin.isString(this._activeStyle))
                    {
                        elem.addClass(this._activeStyle);
                    }
                    else
                    {
                        this._activeStyle(elem);
                    }
                }
                else
                {
                    if(bin.isString(this._activeStyle))
                    {
                        elem.removeClass(this._activeStyle);
                    }

                    if(!this._deactiveStyle)
                    {

                    }
                    else if(bin.isString(this._deactiveStyle))
                    {
                        elem.addClass(this._deactiveStyle);
                    }
                    else
                    {
                        this._deactiveStyle(elem);
                    }
                }
            }

            this._match = match;
        }
    });

    return Route;
});
