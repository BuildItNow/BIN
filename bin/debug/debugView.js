define(
    [
        'bin/core/pageView'
    ],
    function (Base)
    {
        var Class = 
        {
            events:
            {
                "click #debugFloating" : "switchDebugFloating",
                "click #clearDebugInfos" : "clearDebugInfos",
            }
        };

        Class.onViewPush = function(pushFrom, pushData, queryParams)
        {
            this._debugInfos = pushData;
        }

        Class.onShow = function()
        {
            Base.prototype.onShow.call(this);
            
            this.$append("#debugContent", this._debugInfos);
            this._debugInfos.addClass("DebugView-debug-infos");

            this.$html("#debugFloating", bin.debugManager.isFloating() ? "关闭悬浮" : "开启悬浮");
        }

        Class.switchDebugFloating = function()
        {
            bin.debugManager.switchDebugFloating();
            this.$html("#debugFloating", bin.debugManager.isFloating() ? "关闭悬浮" : "开启悬浮");            
        }

        Class.clearDebugInfos = function()
        {
            bin.debugManager.clearDebugInfos();
        }

        Class.onRemove  = function()
        {
            this._debugInfos.removeClass("DebugView-debug-infos");
            this._debugInfos.remove();

            this._debugInfos = null;
        }

        return Base.extend(Class);
    }
);