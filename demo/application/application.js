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

		bin.dataCenter = this._dataCenter;
	}

	Application.run = function()
	{
		bin.naviController.startWith("welcome/index");
	}

	return Base.extend(Application);
});
