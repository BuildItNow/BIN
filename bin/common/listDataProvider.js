define(["underscore", "bin/util/osUtil", "bin/common/extend"], function(_, osUtil, extend)
{
	var defLoadAPI = function(params, success, error)
	{
		bin.netManager.doAPI({api:"/api/refreshList", data:params, success:success, error:error, options:{loading:false, sendCheck:"REJECT_ON_REQUESTING"}});
	}

	var DEFAULT_OPTIONS = 
	{
		pageSize : 20,
		loadAPI  : defLoadAPI,
	}

	var ListDataProvider = function(options)
	{
		this._options = _.extend(osUtil.clone(DEFAULT_OPTIONS), options);

		this._data  = [];
		this._total = -1;
	}

	ListDataProvider.extend = extend;

	var Class = ListDataProvider.prototype;

	Class.refresh = function(success, error)
	{
		var self = this;
		this._options.loadAPI(	{type:this._options.type, page:0, pageSize:this._options.pageSize}, 
								function(netData){self._onRefresh(null, netData, success, error)}, 
								function(netError){self._onRefresh(netError, netData, success, error)});
	}

	Class.loadMore = function(success, error)
	{
		if(!this.anyMore())
		{
			osUtil.nextTick(function()
			{
				success(this.count(), this.count());
			});

			return ;
		}

		var self = this;
		this._options.loadAPI(	{type:this._options.type, page:parseInt(this.count()/this._options.pageSize), pageSize:this._options.pageSize}, 
								function(netData){self._onLoadMore(null, netData, success, error)}, 
								function(netError){self._onLoadMore(netError, netData, success, error)});

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

		success(beg, this.count());
	}

	return ListDataProvider;
});