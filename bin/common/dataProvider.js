define(["bin/core/util"], function(util)
{
	var defLoadAPI = function(params, success, error)
	{
		bin.netManager.doAPI({api:"/api/refreshList", data:params, success:success, error:error, options:{loading:false, sendCheck:"ABORT_ON_REQUESTING"}});
	}

	var DEFAULT_OPTIONS = 
	{
		pageSize : 20,
		loadAPI  : defLoadAPI,
	}

	var ListDataProvider = function(options)
	{
		this._options = _.extend(util.clone(DEFAULT_OPTIONS), options);

		this._data  = [];
		this._total = -1;
	}

	ListDataProvider.extend = bin.extend;

	var Class = ListDataProvider.prototype;

	Class.refresh = function(success, error)
	{
		var self = this;

		var params = {type:this._options.type, page:0, pageSize:this._options.pageSize};
		if(this._options.data)
		{
			if(typeof this._options.data === "function")
			{
				params = _.extend(params, this._options.data(this, params));
			}
			else if(typeof this._options.data === "object")
			{
				params = _.extend(params, this._options.data);
			}
		}

		this._options.loadAPI(	params, 
								function(netData){self._onRefresh(null, netData, success, error)}, 
								function(netError){self._onRefresh(netError, null, success, error)});
	}

	Class.loadMore = function(success, error)
	{
		var self = this;
		if(!this.anyMore())
		{
			setTimeout(function()
			{
				success(self.count(), self.count());
			}, 0);

			return ;
		}

		var params = {type:this._options.type, page:parseInt(this.count()/this._options.pageSize), pageSize:this._options.pageSize};
		if(this._options.data)
		{
			if(typeof this._options.data === "function")
			{
				params = _.extend(params, this._options.data(this, params));
			}
			else if(typeof this._options.data === "object")
			{
				params = _.extend(params, this._options.data);
			}
		}

		this._options.loadAPI(	params, 
								function(netData){self._onLoadMore(null, netData, success, error)}, 
								function(netError){self._onLoadMore(netError, null, success, error)});

	}

	Class.count = function()
	{
		return this._data.length;
	}

	Class.total = function()
	{
		return this._total;
	}

	Class.data = function(i)
	{
		return this._data[i];
	}

	Class.anyMore = function()
	{
		return this._total >= 0 && this._data.length < this._total;
	}

	Class._onRefresh = function(netError, netData, success, error)
	{
		if(netError)
		{
			error(netError);

			return ;
		}

		this._total = netData.data.total;
		this._data  = netData.data.data || [];

		success(0, this.count()); 
	}

	Class._onLoadMore = function(netError, netData, success, error)
	{
		if(netError)
		{
			error(netError);

			return ;
		}

		var beg = this.count();
		if(netData.data.data && netData.data.data.length > 0)
		{
			this._data = this._data.concat(netData.data.data);
		}

		// want to redefine total ?
		if(typeof(netData.data.total) === "number")
		{
			this._total = netData.data.total;
		}

		success(beg, this.count());
	}

	return ListDataProvider;
});