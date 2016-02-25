define(
    [
        "bin/util/osUtil",
        "text!bin/debug/debugFloatingView.html"
    ],
    function (osUtil, floatingHtml)
    {
    	var DebugManager = function()
    	{

    	}

    	DebugManager.extend = bin.extend;

        var Class = 
        {

        }

        Class.init = function()
        {
            var self = this;

            var root = $("#HUDContainer");
            this._debugHUD = $(floatingHtml);
            root.append(this._debugHUD);
            this._debugHUD.find("#debugSwitch").on("click", function()
            {
                if(bin.naviController.getView('bin/debug/debugView'))
                {
                    bin.naviController.pop();
                }
                else
                {
                    bin.naviController.push("bin/debug/debugView", self._elemInfos);
                }
            });

            this._debugHUD.find("#deviceBack").on("click", function()
            {
                bin.app.onDeviceBack();
            });
            this._debugFloating = this._debugHUD.find("#debugFloating");
            this._elemFloatingInfos = this._debugHUD.find("#debugInfos");

            var infoImpl = console.info;
            this._info = function(msg)
            {
                infoImpl.call(console, msg);
            }

            console.info = function(msg)
        	{
                self._appendMessage("[INFO]", msg);
            }

        	console.log = function(msg)
        	{
                self._appendMessage("[LOG]", msg);
            }

            console.error = function(msg)
            {
                self._appendMessage("[ERROR]", msg);
            }

            console.warning = function(msg)
            {
                self._appendMessage("[WARNING]", msg);
            }

            this._elemInfos = $("<textarea></textarea>");
            this._messages = "";

            this._floating = true;
            this.switchDebugFloating();
            
            this.setDebugable(bin.runtimeConfig.debug);

            this._profileStack = [];
            this._profilSpaces = ["", " ", "  ", "   ", "    ", "     ", "      ", "       ", "        ", "         ", "          "];
        
            console.info("DebugManager module initialize");
        }

        Class._appendMessage = function(tag, msg)
        {
            tag = tag || "[INFO]";
            msg = osUtil.dump(msg);
            msg = tag+" "+msg;
            this._info(msg);
            if(!this.isDebugable())
            {
                return ;
            }

            var self = this;
            osUtil.nextTick(function() // Use async call, these operations cost much time when profile
            {
                if(self._messages.length > 1024*24)
                {
                    self._messages = "";
                }
                self._messages += msg+"\n";
                self._elemInfos.text(self._messages);
                self._elemInfos[0].scrollTop = self._elemInfos[0].scrollHeight;
                self._elemFloatingInfos.text(self._messages);
                self._elemFloatingInfos[0].scrollTop = self._elemFloatingInfos[0].scrollHeight;
            });
        }

        Class.isFloating = function()
        {
            return this._floating;
        }

        Class.switchDebugFloating = function()
        {
            if(this._floating)
            {
                this._floating = false;
                this._debugFloating.hide();    
            } 
            else
            {
                this._floating = true;
                this._debugFloating.show();
            }
        }

        Class.clearDebugInfos = function()
        {
            this._messages = "";

            this._elemInfos.text(this._messages);
            this._elemInfos[0].scrollTop = this._elemInfos[0].scrollHeight;
            this._elemFloatingInfos.text(this._messages);
            this._elemFloatingInfos[0].scrollTop = this._elemFloatingInfos[0].scrollHeight;
        }

        Class.setDebugable = function(debugable)
        {
            if(this._debugable === debugable)
            {
                return ;
            }

            this._debugable = debugable;

            if(this._debugable)
            {
                this._debugHUD.show();
            }
            else
            {
                this._debugHUD.hide();
            }
        }

        Class.isDebugable = function()
        {
            return this._debugable;
        }

        Class.profileBeg = function(name)
        {
            this._profileStack.push({name:name, time:osUtil.time()});
        }

        Class.profileEnd = function()
        {
            var item = this._profileStack.pop();
            var len  = Math.min(10, this._profileStack.length);
            var time = osUtil.time();
            var self = this;
            osUtil.nextTick(function()
            {
                var msg = self._profilSpaces[len] + item.name + " "+(time-item.time);
                console.log(msg);
            });
        }

        _.extend(DebugManager.prototype, Class);

        return DebugManager;
    }
);