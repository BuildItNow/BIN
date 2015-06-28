define(
["bin/core/application", "application/dataCenter", "css!application/css/demo.css"],
function(Base, DataCenter)
{
	var Application = {};

	Application.init = function()
	{
		Base.prototype.init.call(this);

		this._dataCenter = new DataCenter();
		this._dataCenter.init();

		this._dataCenter.setGlobalValue("A", undefined);
	}

	Application.run = function()
	{
		bin.naviController.startWith("welcome/index");
	}

	return Base.extend(Application);
});
