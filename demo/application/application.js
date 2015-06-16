define(
["bin/core/application", "bin/core/dataCenter", "css!application/css/demo.css"],
function(Base, DataCenter)
{
	var Application = {};

	Application.init = function()
	{
		Base.prototype.init.call(this);
	}

	Application.run = function()
	{
		bin.naviController.startWith("welcome/index");
	}

	return Base.extend(Application);
});
