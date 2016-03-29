
define([], function () 
{
    'use strict';

    var plugin = 
    {
        load: function(name, req, onLoad, config)
        {
              window.mapLoadDone = function()
              {
                  console.info("Map Load Succeed");
                  onLoad(null);
              }

              req(["http://api.map.baidu.com/api?v="+name+"&ak=r6xCRD3KfUmiDNoAdE7Ec85f&callback=mapLoadDone"], function()
              {

              },
              function(err)
              {
                  require.undef(err.requireModules[0]);
                  onLoad.error(err);
              });
        }
    }

    return plugin;
});
