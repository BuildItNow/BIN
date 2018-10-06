define(
["bin/core/route"], 
function(Route)
{
    var queryString = bin.toQueryString;

    var queryParams = bin.toQueryParams;

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
        if(this._routing)
        {
            return ;
        }

        this._routing = true;

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

        var unmatches = [];
        var matches   = [];

        var fist = this._routes;
        var next = fist.next;
        var func = null;
        while(next !== fist)
        {
            func = next.onRoute(this._routeContext.path);
            if(func)
            {
                (func.match ? matches : unmatches).push(func);
            }

            next = next.next;
        }

        // Do unmatch first, as reverse order
        for(var i=unmatches.length-1; i>=0; --i)
        {
            unmatches[i]();
        }

        for(var i=0,i_sz=matches.length; i<i_sz; ++i)
        {
            matches[i]();
        }

        this.trigger("ROUTE-CHANGE", this._routeContext.path);

        this._routing = false;
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

            if(!this._routing)
            {
                this.trigger("ROUTE-CHANGE", this._routeContext.path);
            }
        }
        else
        {
            this.onRoute(path, data);
        }
    }

    pro.push = function(path, data, options)
    {
        if(data)
        {
            path = path+(path.indexOf("?")<0 ? "?" : "&")+queryString(data);
        }

        if (!options) {
            options = {};
        }

        if (options.trigger === undefined) {
            options.trigger = true;
        }

        Backbone.history.navigate(path, options);
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
