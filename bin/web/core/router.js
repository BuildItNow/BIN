define(
["bin/web/core/route"], 
function(Route)
{
    var queryString = function(data)
    {
        var ret = "";

        if(bin.isString(data))
        {
            ret = data;
        }
        else
        {
            var pairs = [];
            var value = null;
            for(var key in data)
            {
                value = data[key];
                if(value !== null && value !== undefined)
                {
                    if(typeof value === "object")
                    {
                        value = "_json_"+JSON.stringify(value);
                    }
                }
                pairs.push(key+"="+value);    
            }

            ret = pairs.join("&");
        }

        return ret;
    }

    var queryParams = function(queryString) 
    {
        var ret = {};

        if(queryString === undefined || queryString === null || queryString === "")
        {
            return ret;
        }

        queryString = decodeURI(queryString);

        var pairs = queryString.split("&");
        var v = null;
        var pair = null;
        for(i = 0; i < pairs.length; ++i) 
        {
            pair = pairs[i].split('=');
            if(pair.length === 2)
            {
                v = pair[1]
                if(v && v.length >= 6 && v.substr(0, 6) === "_json_")
                {
                    v = v.substr(6);
                    v = JSON.parse(v);
                }
                ret[pair[0]] = v;
            }
        }

        return ret;
    }

    var Router = function()
    {

    }

    Router.extend = bin.extend;

    var pro = Router.prototype;

    pro.init = function()
    {
        var routes = {prev:null, next:null};
        routes.prev = routes;
        routes.next = routes;

        this._routes = routes;

        var self = this;

        this._router = new Backbone.Router({
            routes: 
            {
                "*path(?*queryString)": function(path, queryString)
                {
                    path = path || "";
                    queryString = queryString || "";
                    self.onRoute(path, queryString);
                }
            }
        });

        Backbone.history.start();

        console.log("Router module initialize");
    }

    pro.onRoute = function(path, queryString)
    {
        this._routeContext = {path: path};

        if(!queryString)
        {

        }
        else if(bin.isObject(queryString))
        {
            this._routeContext.queryParams = queryString;
        }
        else if(bin.isString(queryString))
        {
            this._routeContext.queryString = queryString;
        }

        var fist = this._routes;
        var next = fist.next;
        while(next !== fist)
        {
            next.onRoute(this._routeContext.path);

            next = next.next;
        }

        this.trigger("ROUTE-CHANGE", this._routeContext.path);
    }

    pro.getRouteContext = function()
    {
        return this._routeContext;
    }

    pro.getRoutePath = function()
    {
        return this._routeContext.path;
    }

    pro.getRouteQueryString = function()
    {
        if(!this._routeContext.queryString && this._routeContext.queryParams)
        {
            this._routeContext.queryString = queryString(this._routeContext.queryParams);
        }

        return this._routeContext.queryString;
    }

    pro.getRouteQueryParams = function()
    {
        if(!this._routeContext.queryParams && this._routeContext.queryString)
        {
            this._routeContext.queryParams = queryParams(this._routeContext.queryString);
        }

        return this._routeContext.queryParams;
    }

    pro.addRoute = function(route)
    {
        var last = this._routes.prev;

        route.prev = last;
        route.next = this._routes;

        last.next = route;
        this._routes.prev = route;
    }

    pro.remRoute = function(route)
    {
        route.prev.next = route.next;
        route.next.prev = route.prev;

        route.prev = null;
        route.next = null;
    }

    pro.mock = function(path, data, noTrigger)
    {
        var i = path.indexOf("?");
        if(i > 0)
        {
            var queryString = path.substring(i+1);

            if(!data)
            {
                data = queryString;
            }
            else if(bin.isObject(data))
            {
                data = _.extend(data, queryParams(queryString));
            }
            else if(bin.isString(data))
            {
                data = queryString+"&"+data;
            }

            path = path.substring(0, i);
        }

        if(noTrigger)
        {
            this._routeContext = {path: path};

            if(!data)
            {

            }
            else if(bin.isObject(data))
            {
                this._routeContext.queryParams = data;
            }
            else if(bin.isString(data))
            {
                this._routeContext.queryString = data;
            }
        }
        else
        {
            this.onRoute(path, data);
        }
    }

    pro.push = function(path, data)
    {
        if(data)
        {
            path = path+(path.indexOf("?")<0 ? "?" : "&")+queryString(data);
        }

        Backbone.history.navigate(path, {trigger:true});
    }

    pro.pop = function(n)
    {
        if(!n)
        {
            n = -1;
        }
        else if(n>0)
        {
            n = -n;
        }   
        window.history.go(n);
    }

    _.extend(pro, Backbone.Events);

    return Router;
});