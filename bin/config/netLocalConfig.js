(function()
{
	var config = {};
	var TURN_ON  = true;
	var TURN_OFF = false;

	var CASE = function(api, on, data, options)
	{
		if(on)
		{
			if(typeof(options) === "string")
			{
				options = {method:options};
			}

			config[api] = {data:data, options:options};
		}
	}
	define(
	[],
	function()
	{
		// Start your config here
		CASE("/api/byFunction", TURN_ON, function(netParams)
			{
				return "api/byFunction : Welcome to BIN"
			},"GET");

		CASE("/api/byData", TURN_ON, "api/byData : Welcome to BIN", "GET");

		CASE("/api/byFile", TURN_ON, "file!../netLocalDemo/test.json", "POST");

		CASE("/api/testAPI", TURN_ON, {a:10, b:"Hello BIN", c:{a:20, b:10}});

		CASE("/api/refreshList", TURN_ON, function(netParams)
			{	
				var ret = 
				{
				};

				if(netParams.data.page === 0)
				{
					ret.total = parseInt(Math.random()*60);

				}

				ret.data = [];
				
				for(var i=0,i_sz=netParams.data.pageSize; i<i_sz; ++i)
				{
					ret.data.push({label:"Hello "+i});
				}

				return ret;
			});
		
		return config;
	});
}());