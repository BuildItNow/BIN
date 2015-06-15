define(
    [
        "underscore",
        "bin/core/view",
        "bin/core/pageView-animation",
        "bin/util/osUtil", 
    ],
    function (_, Base, PageViewAnimation, osUtil)
    {
        var Class =
        {
            // for mannually created view, the view's dom will be created in constructor,
            // if the view is created by butterfly, html will be ignored.
            html:null,          
        };

        Class.goBack = function()
        {
            bin.naviController.pop();
        }


        // Get the data by foward view. bfNaviController.pop(1, {xxx:xxx})
        Class.onViewBack = function(backFrom, backData)
        {
            //console.info("backFrom "+backFrom);
        }

        Class.onViewPush = function(pushFrom, pushData, queryParams)
        {
            //console.info("pushFrom "+pushFrom);
            //console.info("queryParams");
            //console.info(queryParams);
        }
        
        // called when device back button click (For android)
        Class.onDeviceBack = function()
        {
            return false;
        }

        _.extend(Class, PageViewAnimation);
    
        return Base.extend(Class);
    }
);


