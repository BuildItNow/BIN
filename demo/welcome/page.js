define(
	["bin/core/naviPageView"],
	function(Base)
	{
		return Base.extend(
			{
				events:
				{
					"click .PageView-button":"onButtonClick"
				},
				onShow : function()
				{

				},
				onViewBack:function(backFrom, backData)
				{
					if(backData)
					{
						alert("从"+backFrom+"返回,返回数据 "+backData);
					}
				},
				onViewPush:function(pushFrom, pushData)
				{
					if(pushData)
					{
						alert("从"+pushFrom+"跳转,跳转数据 "+pushData);
					}
				},
				onButtonClick:function(e)
				{
					var id = e.currentTarget.id;

					switch(id)
					{
						case "pop":
						{
							bin.naviController.pop();
						}
						break;
						case "pop2":
						{
							bin.naviController.pop(2);
						}
						break;
						case "popWithData":
						{
							bin.naviController.pop(1, "Pop : Hello BIN");
						}
						break;
						case "popTo":
						{
							bin.naviController.popTo("welcome/index.html");
						}
						break;
						case "push":
						{
							bin.naviController.push("welcome/page2.html");
						}
						break;
						case "pushWithData":
						{
							bin.naviController.push("welcome/page2.html", "Push : Hello BIN");
						}
						break;
					}
				},
				onRight:function()
				{
					this.setRightText(""+Math.random());
				}
			});
	}
);