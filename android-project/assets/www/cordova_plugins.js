cordova.define('cordova/plugin_list', function(require, exports, module)
{
    module.exports = [
    {
        "file": "plugins/com.bin.common/common.js",
        "id": "com.bin.plugins.common",
        "clobbers": 
        [
            "cordova.binPlugins.common"
        ]
    },
    ];
    module.exports.metadata = 
    {
        "com.bin.plugins.common": "1.0.0",
    };
});