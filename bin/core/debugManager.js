define(
    [
        "underscore", 
        "bin/common/extend", 
        "bin/util/osUtil"
    ],
    function (_, extend, osUtil)
    {
    	var DebugManager = function()
    	{

    	}

    	DebugManager.extend = extend;

        var Class = 
        {

        }

        Class.init = function()
        {
            var self = this;

            var root = $("#HUDContainer");
            this._debugHUD = $("<div id='debugHUD' style='position:absolute;background-color:transparent;pointer-events:none;z-index:2;width:100%;height:100%;text-align:center;'><div id='debugSwitch' style='pointer-events:auto;margin-left:auto;margin-right:auto;width:60px;height:38px;background-color:black;opacity:0.3;left:0px;top:0px;'></div><div id='debugFloating' style='position:absolute;width:100%;top:38px;bottom:0px;pointer-events:none;opacity:0.5;background-color:#888;'><textarea id='debugInfos' style=' width:100%;height:100%;font-size: 10px;line-height: 12px;padding:5px;margin: 0px;border: none;'></textarea></div></div>");
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

        Class._dumpObject = function(obj)
        {
            var showed = [];
            if(obj === null || obj === undefined)
            {
                return "["+obj+"]";
            }

            var padding  = function(len)
            {
                var ret = "";
                for(var i=0; i<len; ++i)
                {
                    ret += "  ";
                }

                return ret;
            }

            var memberPadding = function(len)
            {
                return padding(len+1);
            }

            var toString = null;

            toString = function(obj, len)
            {
                len = len || 0;

                var ret = "";

                if(showed.indexOf(obj) >= 0)
                {
                    return ret;
                }
                showed.push(obj);

                if(_.isArray(obj))
                {
                    if(len > 3)
                    {
                        ret += padding(len)+"[...]";
                    }
                    else
                    {
                        ret += padding(len)+"[\n";
                        var t = null;
                        for(var i=0; i<obj.length; ++i)
                        {
                            if(i>0)
                            {
                                ret += ",\n";   
                            }
                            t = typeof(obj[i]);
                            
                            if(t === "function")
                            {
                                ret += memberPadding(len)+"[function]";
                            }
                            else if(_.isArray(obj[i]) || _.isObject(obj[i]))
                            {
                                ret += toString(obj[i], len+1);
                            }
                            else
                            {
                                ret += memberPadding(len)+obj[i]; 
                            }
                        }
                        ret += "\n"+padding(len)+"]";
                    }
                }
                else
                {
                    if(len > 3)
                    {
                        ret += padding(len)+"{...}";
                    }
                    else
                    {
                        ret += padding(len)+"{\n";
                        var t = null;
                        var v = null;
                        var f = true;
                        for(var key in obj)
                        { 
                            if(!f)
                            {
                                ret += ",\n";
                            }

                            f = false;
                            v = obj[key];
                            t = typeof(v);
                            ret += memberPadding(len)+key+":";
                            if(t === "function")
                            {
                                ret += "[function]";
                            }
                            else if (_.isArray(v) || _.isObject(v)) 
                            {    
                                var s = toString(v, len+1);
                                ret += s.length > 0 ? "\n"+s : "[showed]";    
                            }
                            else
                            {
                                ret += v; 
                            }                               
                        }
                        ret += "\n"+padding(len)+"}";
                    }
                }

                return ret;
            }

            var ret = null;
            var t   = typeof(obj);
            if(t === "function")
            {
                ret = "[function]";
            }
            else if(t === "object")
            {
                ret = toString(obj);
            } 
            else
            {
                ret = obj+"";
            }
            
            return ret;
        }

        Class._appendMessage = function(tag, msg)
        {
            tag = tag || "[INFO]";
            msg = this._dumpObject(msg);
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