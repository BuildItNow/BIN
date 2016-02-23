define(
	[
		"bin/common/extend", 
        "bin/util/osUtil"
    ],
    function(extend, osUtil)
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

		NativeManager.extend = extend;

		var Class = NativeManager.prototype;

		Class.init = function()
		{
			if(!cordova)	// Only work with native device
			{
				return ;
			}

			// Script objects
			this._key2References = {};
			this._obj2References = {};
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
			var ref = this._obj2References[object];
			if(ref)
			{
				return ref;
			}

			ref = new ScriptObjectReference(""+this._nxtKey, object);
			this._key2References[ref.key] = ref;
			this._obj2References[object]  = ref;

			++this._nxtKey;

			return ref;
		}

		Class.remScriptObjectByKey = function(key)
		{
			var ref = this._key2References[key];
			if(!ref)
			{
				return ;
			}

			delete this._key2References[ref.key];
			delete this._obj2References[ref.object];
		}

		Class.remScriptObject = function(object)
		{
			var ref = this._obj2References[object];
			if(!ref)
			{
				return ;
			}

			delete this._key2References[ref.key];
			delete this._obj2References[ref.object];
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
			if(ref.ref == 0)
			{
				this.remScriptObject(key);
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

			cordova.binPlugins.nativeBridge.doCB(cb, [object[name]]);
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

			var ret = object[name](args);
			ret = _.isArray(ret) ? ret : [ret];

			cordova.binPlugins.nativeBridge.doCB(cb, ret);
		}

		Class.soSet = function(key, name, data)
		{
			var object = this.getScriptObject(key);
			if(!object)
			{
				return ;
			}

			data = JSON.parse(data);
			// data wraps in array 0
			object[name] = this.argFmNative(data[0]);
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
				return arg;
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
				return arg;
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

		return NativeManager;
	});