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

		CASE("/api/byData", TURN_ON, "api/byData : Welcome to BIN", {method:"GET", costTime:1000});

		CASE("/api/byFile", TURN_ON, "file!./netLocalDemo/test.json", "POST");

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

				var images = ["http://blog.chinaunix.net/attachment/201404/1/26651460_1396326596UZGH.jpg"
        ,"http://blog.chinaunix.net/attachment/201404/1/26651460_1396326599GZ3U.jpg"
        ,"http://blog.chinaunix.net/attachment/201404/1/26651460_1396326608lY8C.jpg"
        ,"http://blog.chinaunix.net/attachment/201404/1/26651460_1396326626Q1rv.jpg"
        ,"http://img.ruanman.net/files/2014/05/103341335.jpg"
        ,"http://img5.imgtn.bdimg.com/it/u=1751735675,2912360032&fm=21&gp=0.jpg"
        ,"http://i2.sinaimg.cn/gm/2014/0917/U10751P115DT20140917110436.png"
        ,"http://blog.chinaunix.net/attachment/201404/1/26651460_1396326638Uopp.jpg"
        ,"http://blog.chinaunix.net/attachment/201404/1/26651460_13963266245gUx.jpg"
        ,"http://blog.chinaunix.net/attachment/201404/1/26651460_13963266108x09.jpg"
        ,"http://blog.chinaunix.net/attachment/201404/1/26651460_1396326611Tpn9.jpg"];
				
				for(var i=0,i_sz=netParams.data.pageSize; i<i_sz; ++i)
				{
					ret.data.push({label:"Hello "+i, icon:images[parseInt(Math.random()*1000)%images.length]});
				}

				return ret;
			});
		
		return config;
	});
}());