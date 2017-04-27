define(
    [
        "bin/core/view",
        "bin/core/pageView-animation"
    ],
    function (Base, PageViewAnimation)
    {
        var Class =
        {
            // for mannually created view, the view's dom will be created in constructor,
            // if the view is created by framework, html will be ignored.
            html:null,          
        };

        var REQ_STATUS_NONE = 0;
        var REQ_STATUS_REQUESTING = 1;
        var REQ_STATUS_DONE = 2;

        Class.constructor = function(options)
        {
            if(options && options.fromNavi)
            {
                this._reqsStatus = REQ_STATUS_NONE;
                this._requests   = [];
            }
            else
            {
                this._reqsStatus = REQ_STATUS_DONE;
            }
            
            Base.prototype.constructor.call(this, options);
        }

        Class.request = function(impl, success, error)
        {
            if(!impl && !error)  // Just want to do something after page animation
            {
                if(success)
                {
                    impl = function(s, e){s();}
                }
                else
                {
                    impl = Promise.resolve();
                }
            }

            var o = this._requestor(impl);
            if(success)
            {
                o.success(success);
            }

            if(error)
            {
                o.error(error);
            }

            if(this._reqsStatus === REQ_STATUS_DONE || this._reqsStatus === REQ_STATUS_REQUESTING)
            {
                setTimeout(function()
                {
                    o.do();
                });
            }

            if(this._reqsStatus === REQ_STATUS_REQUESTING || this._reqsStatus === REQ_STATUS_NONE)
            {
                this._requests.push(o);
            }

            return o._prose;
        }

        Class._requestor = function(impl)
        {
            var self = this;

            var r = {_impl:impl};
            r.success = function(impl)
            {
                r._sImpl = impl;

                return r;
            }

            r.error = function(impl)
            {
                r._eImpl = impl;

                return r;
            }

            r.do = function()
            {
                this._impl(
                function()
                {
                    if(self._reqsStatus === REQ_STATUS_DONE)
                    {
                        r._sImpl.apply(r, arguments);
                    }
                    else
                    {
                        r._sArgs = arguments;
                        r._sDone = true;
                    }
                }, 
                function()
                {   
                    if(self._reqsStatus === REQ_STATUS_DONE)
                    {
                        r._eImpl.apply(r, arguments);
                    }
                    else
                    {
                        r._eArgs = arguments;
                        r._eDone = true;
                    }
                });
            }

            r.done = function()
            {
                if(this._sDone && this._sImpl)
                {
                    this._sImpl.apply(this, this._sArgs);
                }
                else if(this._eDone && this._eImpl)
                {
                    this._eImpl.apply(this, this._eArgs);
                }
            }

            if(typeof impl === "object")    // promise
            {
                r._pImpl = impl;
                r._prose = new Promise(function(resolve, reject)
                {
                    r._pResolve = resolve;
                    r._pReject  = reject;
                });

                r._impl = function(success, error)
                {
                    this._pImpl.then(success).catch(error);
                }

                r._sImpl = function(data)
                {
                    this._pResolve(data);
                }

                r._eImpl = function(error)
                {
                    this._pReject(error);
                }
            }

            return r;
        }

        Class.goBack = function(backData)
        {
            bin.naviController.pop(1, backData);
        }

        Class.$content = function()
        {
            return this.$(".bin-page-content");
        }

        Class.doRequesting = function()
        {
            if(this._reqsStatus === REQ_STATUS_NONE)
            {
                if(this._requests.length > 0)
                {
                    var requests = this._requests;
                    setTimeout(function()
                    {
                        for(var i=0,i_sz=requests.length; i<i_sz; ++i)
                        {
                            requests[i].do();
                        }
                    });
                }

                this._reqsStatus = REQ_STATUS_REQUESTING;
            }
        }

        Class.doRequestDone = function()
        {
            if(this._reqsStatus === REQ_STATUS_REQUESTING)
            {
                var requests = this._requests;
                for(var i=0,i_sz=requests.length; i<i_sz; ++i)
                {
                    requests[i].done();
                }
                
                delete this._requests;

                this._reqsStatus = REQ_STATUS_DONE;
            }
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


