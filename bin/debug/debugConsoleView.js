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
                "click #debugExecute" : "executeScript",
                "click #debugPrint": "printScript",
                "click #clearDebugInfos" : "clearDebugInfos",
                "click #prev" : "prevScript",
                "click #next" : "nextScript",
            }
        };

        var sScriptBufferTemp = [];
        var sScriptBuffer     = [];
        var sScriptIndex      = 0;

        Class.onViewPush = function(pushFrom, pushData, queryParams)
        {
            this._debugInfos = pushData;
        }

        Class.genHTML = function()
        {
            this.$append("#debugContent", this._debugInfos);
            this._debugInfos.addClass("DebugConsoleView-debug-output");

            Base.prototype.genHTML.call(this);
        }

        Class.executeScript = function()
        {
            var script = this.$("#input").val();
            if(!script)
            {
                bin.hudManager.showStatus("请输入执行内容");
                return ;
            }

            try
            {
                eval(script);
                this.fixScriptBuffer(script);
            }
            catch(e)
            {
                bin.hudManager.showStatus("脚本执行错误");
            }
        }

        Class.printScript = function()
        {
            var script = this.$("#input").val();
            if(!script)
            {
                bin.hudManager.showStatus("请输入执行内容");
                return ;
            }

            try
            {
                eval("console.log("+script+")");
                this.fixScriptBuffer(script);
            }
            catch(e)
            {
                bin.hudManager.showStatus("脚本执行错误");
            }
        }

        Class.clearDebugInfos = function()
        {
            bin.debugManager.clearDebugInfos();
        }

        Class.fixScriptBuffer = function(script)
        {
            sScriptBufferTemp = sScriptBuffer;

            if(sScriptBufferTemp.length > 30)
            {
                sScriptBufferTemp = sScriptBufferTemp.splice(0, 30);
            }

            sScriptBuffer = [];
            for(var i=0,i_sz=sScriptBufferTemp.length; i<i_sz; ++i)
            {
                if(sScriptBufferTemp[i] === script)
                {
                    continue;
                }

                sScriptBuffer.push(sScriptBufferTemp[i]);
            }

            sScriptBuffer.unshift(script);
            sScriptIndex = 0;
        }

        Class.prevScript = function()
        {
            var script = sScriptBuffer.length > 0 ? sScriptBuffer[sScriptIndex] : null;
            if(script)
            {
                this.$("#input").val(script);
                ++sScriptIndex;
                sScriptIndex = sScriptIndex%sScriptBuffer.length;
            }
        }

        Class.nextScript = function()
        {
            var script = sScriptBuffer.length > 0 ? sScriptBuffer[sScriptIndex] : null;
            if(script)
            {
                this.$("#input").val(script);
                --sScriptIndex;
                if(sScriptIndex<0)
                {
                    sScriptIndex = sScriptBuffer.length-1;
                }
            }
        }

        Class.onRemove  = function()
        {
            this._debugInfos.removeClass("DebugConsoleView-debug-output");
            this._debugInfos.detach();

            this._debugInfos = null;
        }

        return Base.extend(Class);
    }
);