define(["bin/core/naviPageView"],
	function(Base)
	{
		var Class = {};

		Class.onViewPush = function(pushFrom, pushData)
		{
			this._config = pushData;
		}

		Class.genHTML = function()
		{
			Base.prototype.genHTML.call(this);

			this.setTitle("示例 "+this._config.name);
		}

		return Base.extend(Class);
	});