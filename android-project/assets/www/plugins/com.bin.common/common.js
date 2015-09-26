cordova.define("com.bin.plugins.common", function(require, exports, module) 
{   
    var defSuccess = function()
    {

    }

    var defError = function()
    {

    }

    var exec = require('cordova/exec');
    var Class = {};
    Class.openSystemBrowser = function(url) 
    {
        exec(defSuccess, defError, "Common", "openSystemBrowser", [url]);
    }
    
    module.exports = Class;
});
