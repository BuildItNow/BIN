define(
    function()
    {
        var cls = {};

        cls.save = function(name, data)
        {
            window.localStorage[name] = JSON.stringify(data);
        }
            
        cls.load = function(name)
        {
            var ret = window.localStorage[name];

            return ret ? JSON.parse(ret) : null;
        }

        cls.clear = function(name)
        {
            window.localStorage[name] = null;
        }

        return cls;
    }
);