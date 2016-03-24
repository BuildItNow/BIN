define(
    [
        "bin/core/view",
        "bin/core/pageView-animation",
        "bin/util/osUtil", 
    ],
    function (Base, PageViewAnimation, osUtil)
    {
        var Class =
        {
            // for mannually created view, the view's dom will be created in constructor,
            // if the view is created by framework, html will be ignored.
            html:null,          
        };

        Class.goBack = function(backData)
        {
            bin.naviController.pop(1, backData);
        }

        Class.$content = function()
        {
            return this.$(".bin-page-content");
        }

        // For performance reason, don't define these function in base class, 
        // You can overwrite these function in your class to get these features.
        
        //Class.onViewBack = function(backFrom, backData)
        //{
        
        //}

        //Class.onViewPush = function(pushFrom, pushData, queryParams)
        //{
        
        //}

        //Class.onInAnimationBeg = function()
        //{

        //}

        //Class.onInAnimationEnd = function()
        //{
            
        //}
        
        //Class.onDeviceBack = function()
        //{
        //    return false;
        //}

        _.extend(Class, PageViewAnimation);
    
        return Base.extend(Class);
    }
);


