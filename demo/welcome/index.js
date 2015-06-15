define(
	["bin/core/naviPageView", "welcome/client"],
	function(Base, Client)
	{
		return Base.extend(
			{
				events:
				{
					"click #naviByFadeIO,#naviByRightIO,#naviByRightILeftO":"onNaviWithEffect"
				},
				asyncPosGenHTML : function()
				{
					var self = this;
					Client.apiByFunction(function(data)
					{
						self.elementHTML("#testAPIByFunction", data.data);
					})

					Client.apiByData(function(data)
					{
						self.elementHTML("#testAPIByData", data.data);
					})

					Client.apiByFile(function(data)
					{
						self.elementHTML("#testAPIByFile", data.data);
					})
				},
				onNaviWithEffect:function(e)
				{
					var id = e.currentTarget.id;

					switch(id)
					{
						case "naviByFadeIO":
						{
							bin.naviController.push("welcome/page.html", null, {effect:"fadeIO"});
						}
						break;
						case "naviByRightIO":
						{
							bin.naviController.push("welcome/page.html", null, {effect:"rightIO"});
						}
						break;
						case "naviByRightILeftO":
						{
							bin.naviController.push("welcome/page.html", null, {effect:"rightILeftO"});
						}
						break;
					}
				}
			});
	}
);