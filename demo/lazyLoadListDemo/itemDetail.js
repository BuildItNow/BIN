define(
	["bin/core/naviPageView"],
	function(Base)
	{
		var Class = {};

		Class.onViewPush = function(pushFrom, pushData)
		{
			this._pushData = pushData;
		}

		Class.posGenHTML = function()
		{
			this.setTitle("ITEM ID "+this._pushData.id);

			this.$html(".bin-page-content", this._pushData.data.label);
		}

		return Base.extend(Class);
	}
);