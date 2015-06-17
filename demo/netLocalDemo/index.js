define(
	["common/demoView", "netLocalDemo/client", "bin/util/osUtil"],
	function(Base, Client, osUtil)
	{
		var Class = {};

		Class.events = 
		{
			"click #byData,#byFunc,#byFile" : "sendRequest"
		};

		Class.sendRequest = function(e)
		{
			var self = this;
			var onRequestResult = function(data)
			{
				self.$("#requestResult").text(osUtil.dump(data));
			}

			switch(e.currentTarget.id)
			{
				case "byData":
				{
					Client.apiByData(onRequestResult);
				}
				break;
				case "byFunc":
				{
					Client.apiByFunction(onRequestResult);
				}
				break;
				case "byFile":
				{
					Client.apiByFile(onRequestResult);
				}
				break;
			}
		}

		return Base.extend(Class);
	}
);