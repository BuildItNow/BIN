define(
	["common/demoView", "netDemo/client", "bin/util/osUtil"],
	function(Base, Client, osUtil)
	{
		var Class = {};

		Class.events = 
		{
			"click #global" : "global",
			"click #globalRead" : "globalRead",
			"click #globalSession" : "globalSession",
			"click #globalSessionRead" : "globalSessionRead",
			"click #AUserLogin" : "AUserLogin",
			"click #AUserLogout" : "AUserLogout",
			"click #BUserLogin" : "BUserLogin",
			"click #BUserLogout" : "BUserLogout",
			"click #User" : "User",
			"click #UserRead" : "UserRead",
			"click #UserSession" : "UserSession",
			"click #UserSessionRead" : "UserSessionRead",
		};

		Class.global = function()
		{
			bin.dataCenter.setGlobalValue("test", {a:"global"});
		}

		Class.globalRead = function()
		{
			this.$html("#globalResult", osUtil.dump(bin.dataCenter.getGlobalValue("test")));
		}

		Class.globalSession = function()
		{
			bin.dataCenter.setGlobalSessionValue("test", {a:"session"});
		}

		Class.globalSessionRead = function()
		{
			this.$html("#globalSessionResult", osUtil.dump(bin.dataCenter.getGlobalSessionValue("test")));
		}

		Class.AUserLogin = function()
		{
			bin.dataCenter.onUserLogin("A");
		}

		Class.AUserLogout = function()
		{
			bin.dataCenter.onUserLogout();
		}

		Class.BUserLogin = function()
		{
			bin.dataCenter.onUserLogin("B");
		}

		Class.BUserLogout = function()
		{
			bin.dataCenter.onUserLogout();
		}

		Class.User = function()
		{
			bin.dataCenter.setUserValue("test", {a:"User"});
		}

		Class.UserSession = function()
		{
			bin.dataCenter.setUserSessionValue("test", {a:"SessionUser"});
		}

		Class.UserRead = function()
		{
			this.$html("#userResult", osUtil.dump(bin.dataCenter.getUserValue("test")));
		}

		Class.UserSessionRead = function()
		{
			this.$html("#userResult", osUtil.dump(bin.dataCenter.getUserSessionValue("test")));
		}

		return Base.extend(Class);
	}
);