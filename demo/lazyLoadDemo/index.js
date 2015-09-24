define(
	["common/demoView", "bin/util/osUtil"],
	function(Base, osUtil)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			Base.prototype.posGenHTML.call(this);

			Base.lazyLoadContainer(this.$content());
		}

		return Base.extend(Class);
	}
);