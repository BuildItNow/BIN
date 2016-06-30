define(
	[
		
    ],
    function()
	{

		var NativeObjectProxy = function(key)
		{
			this.key = key;
		}

		var noPro = NativeObjectProxy.prototype;
		noPro._$class = "NativeObjectProxy";

		noPro.exec = function(name, data, cb)
		{
			cordova.binPlugins.nativeBridge.exec(this.key, name, data, cb);
		}
       
        var ScriptObjectReference = function(key, object)
        {
            this.key = key;
       		this.object = object;
       		this.ref = 0;
        }
       
        var soPro = ScriptObjectReference.prototype;
        soPro._$class = "ScriptObjectReference";
    
		var NativeManager = function()
		{

		}

		NativeManager.extend = bin.extend;

		var Class = NativeManager.prototype;

		Class.init = function()
		{
			if(!cordova)	// Only work with native device
			{
				return ;
			}

			// Script objects
			this._key2References = {};
			this._nxtKey = 1;

			// Native objects
			this._nativeObjectProxies = {};

			console.info("NativeManager module initialize");
		}

		Class.release = function()
		{
			delete this._nativeObjectProxies;
		}

		// Native Objects
		Class.addNativeObject = function(key)
		{
			var proxy = new NativeObjectProxy(key);
			this._nativeObjectProxies[key] = proxy;

			var sKey = this.regScriptObject(proxy).key;
			cordova.binPlugins.nativeBridge.linkNativeWithScript(key, sKey);
		}

		Class.remNativeObject = function(key)
		{
			delete this._nativeObjectProxies[key];
		}

		Class.getNativeObject = function(key)
		{
			return this._nativeObjectProxies[key];
		}


		// Script Objects
		Class.regScriptObject = function(object)
		{
			var ref = this._key2References[object._so_key];
			if(ref)
			{
				return ref;
			}

			ref = new ScriptObjectReference(""+this._nxtKey, object);
			this._key2References[ref.key] = ref;
			object._so_key = ref.key;

			++this._nxtKey;

			return ref;
		}

		REG_SCRIPT_OBJECT = function(obj)
		{
			return bin.nativeManager.regScriptObject(obj);
		}

		Class.remScriptObjectByKey = function(key)
		{
			var ref = this._key2References[key];
			if(!ref)
			{
				return ;
			}
			delete ref.object._so_key;
			delete this._key2References[ref.key];
		}

		Class.remScriptObject = function(object)
		{
			this.remScriptObjectByKey(object._so_key);
		}

		Class.refScriptObject = function(key)
		{
			var ref = this._key2References[key];
			if(!ref)
			{
				return ;
			}

			++ref.ref; 
		}

		Class.derefScriptObject = function(key)
		{
			var ref = this._key2References[key];
			if(!ref)
			{
				return ;
			}

			--ref.ref; 
			if(ref.ref === 0)
			{
				//var self = this;
				//setTimeout(function()
				//{
				//	if(ref.ref === 0)
				//	{
						this.remScriptObjectByKey(key);
				//	}
				//}, 0);
			}
		}

		Class.getScriptObject = function(key)
		{
			var ref = this._key2References[key];
			return ref ? ref.object : undefined;
		}

		Class.getScriptObjectRef = function(key)
		{
			var ref = this._key2References[key];
			return ref;
		}

		// Script Object Operations
		Class.soGet = function(key, name, cb)
		{
			var object = this.getScriptObject(key);
			if(!object)
			{
				return ;
			}

			if(cb)
			{
				cordova.binPlugins.nativeBridge.doCB(cb, [object[name]]);
			}
		}

		Class.soCall = function(key, name, args, cb)
		{
			var object = this.getScriptObject(key);
			if(!object)
			{
				return ;
			}

			args = JSON.parse(args);

			args = this.argsFmNative(args);

			object[name](args, function(ret)
			{
				ret = _.isArray(ret) ? ret : [ret];

				if(cb)
				{
					cordova.binPlugins.nativeBridge.doCB(cb, ret);
				}
			});
		}

		Class.soSet = function(key, name, data, cb)
		{
			var object = this.getScriptObject(key);
			if(!object)
			{
				return ;
			}

			data = JSON.parse(data);
			// data wraps in array 0
			object[name] = this.argFmNative(data[0]);

			if(cb)
			{
				cordova.binPlugins.nativeBridge.doCB(cb);
			}
		}

		Class.argToNative = function(arg)
		{
			if(arg === undefined || arg === null)
			{
				return arg;
			}

			if(_.isObject(arg))
			{
				if(arg._$class === "NativeObjectProxy")
				{
					return "bin#no="+arg.key;
				}
				if(arg._$class === "ScriptObjectReference")
				{
					return "bin#so="+arg.key;
				}
			}

			return arg;
		}

		// Arguments Serialization
		Class.argsToNative = function(args)
		{
			if(args === undefined || args === null)
			{
				return args;
			}

			if(!_.isArray(args))
			{
				console.log("Invalid args to native");
				return undefined;
			}

			var ret = [];
			for(var i=0,i_sz=args.length; i<i_sz; ++i)
			{
				ret[i] = this.argToNative(args[i]);
			}

			return ret;
		}

		Class.argFmNative = function(arg)
		{
			if(arg === undefined || arg === null)
			{
				return arg;
			}

			if(!_.isString(arg))
			{
				return arg;
			}
			if(arg.indexOf("bin#") !== 0)
			{
					return arg;
			}
			
			var pos = arg.indexOf("=");
			var key = arg.substring(4, pos);
			var val = arg.substring(pos+1);

			// Native Object
			if(key === "no")
			{
				return this.getNativeObject(val);
			}
			else if(key === "so")
			{
				return this.getScriptObject(val);
			}

			// Unknown
			return undefined;
		}

		Class.argsFmNative = function(args)
		{
			if(args === undefined || args === null)
			{
				return args;
			}

			if(!_.isArray(args))
			{
				console.log("Invalid args from native");
				return undefined;
			}

			var ret = [];
			for(var i=0,i_sz=args.length; i<i_sz; ++i)
			{
				ret[i] = this.argFmNative(args[i]);
			}

			return ret;
		}

		// View pop and push
		Class.push = function(name, data)
		{
			if(data)
			{
				data = JSON.parse(data);
				data = this.argsFmNative(data);
			}

			bin.naviController.push(name, data);
		}

		Class.pop = function(count, data)
		{
			if(data)
			{
				data = JSON.parse(data);
				data = this.argsFmNative(data);
			}

			bin.naviController.pop(count, data);
		}

		Class.popTo = function(name, data)
		{
			if(data)
			{
				data = JSON.parse(data);
				data = this.argsFmNative(data);
			}

			bin.naviController.popTo(name, data);
		}

		return NativeManager;
	});