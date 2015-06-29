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
            // if the view is created by framework, html will be ignored.
            html:null,          
        };

        Class.goBack = function()
        {
            bin.naviController.pop();
        }


        Class.onViewBack = function(backFrom, backData)
        {
        
        }

        Class.onViewPush = function(pushFrom, pushData, queryParams)
        {
        
        }

        Class.onInAnimationBeg = function()
        {

        }

        Class.onInAnimationEnd = function()
        {
            
        }
        
        Class.onDeviceBack = function()
        {
            return false;
        }

        _.extend(Class, PageViewAnimation);
    
        return Base.extend(Class);
    }
);


