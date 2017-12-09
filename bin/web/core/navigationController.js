define(
    ["vue"],
function(Vue)
{
    var NavigationController = function()
    {
    }

    NavigationController.extend = bin.extend;

    var cls = NavigationController.prototype;

    cls.init = function()
    {
        var self = this;
    
        if(Vue)
        {
            // Add directive to Vue
            Vue.directive("navigation", 
            {
                priority:700,
                bind:function()
                {
                    var dirc = this;
                    var arg  = this.arg || "push";
                    var data = undefined;
                    var func = undefined;
                    var view = undefined;
                    if(arg === "push")
                    {
                        view = this.expression;
                        data = this.el.getAttribute("pushData");
                        func = "push";
                    }
                    else if(arg === "pop")
                    {
                        view = this.expression;
                        func = "pop";
                        if(view)
                        {
                            view = parseInt(view);
                        }
                        else
                        {
                            view = 1;
                        }
                    }
                    
                    if(view && typeof view === "string")
                    {
                        view = Vue.b_makeValueFunction(view);
                    }
                    
                    if(data)
                    {
                        data = Vue.b_makeValueFunction(data);
                    }

                    this.handler = function()
                    {
                        self[func](view && typeof view === "function" ? view(dirc.vm._b_view, dirc.vm, dirc.el) : view, data && typeof data === "function" ? data(dirc.vm._b_view, dirc.vm, dirc.el) : data);
                    }

                    this.el.addEventListener("click", this.handler);
                },
                unbind:function()
                {
                    this.el.removeEventListener("click", this.handler);
                },
            });
        }

        console.info("NavigationController module initialize");
    }

    cls.pop = function(count)
    {
        bin.app.back(count);

        return true;
    }

    cls.push = function(name, pushData)
    {
        if(name && name.lastIndexOf(".html") < 0)
        {
            name += ".html";
        }

        bin.app.goto(name, pushData);

        return true;
    }

    cls.pushRoute = function(path, routeData)
    {
        bin.router.push(path, routeData);
    }

    cls.popRoute = function(count)
    {
        bin.router.pop(count);
    }

    return NavigationController;
});
