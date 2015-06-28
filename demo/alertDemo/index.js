define(
	["common/demoView", "bin/util/osUtil"],
	function(Base, osUtil)
	{
		var Class = {};

		Class.events = 
		{
			"click #showAlert" : "showAlert",
			"click #infoAlert" : "infoAlert",
			"click #customAlert" : "customAlert",
			"click #multipleAlert" : "multipleAlert",
		};

		Class.showAlert = function()
		{
			bin.hudManager.alert(
			{
				title:{text:"你好！"},
				message:{text:"BIN是一个轻量的Web APP框架，BIN的目的是让Web APP的开发像Native APP开发一样。BIN基于Cordova，支持Android和IOS平台。"},
				buttons:
				[
					{text:"确认", onClick:function(alertView, title){console.info(title+" Click");alertView.close()}}
				]
			});
		}

		Class.infoAlert = function()
		{
			bin.hudManager.alertInfo("BIN是一个轻量的Web APP框架，BIN的目的是让Web APP的开发像Native APP开发一样。BIN基于Cordova，支持Android和IOS平台。");
		}

		Class.customAlert = function()
		{
			var v = bin.hudManager.alert();
			var elem = v.setTitle({text:"这是一个Title", color:"green"});
			elem.css("font-size", "1rem");
			elem.css("line-height", "2rem");
			elem.css("height", "2rem");
			elem.css("padding", "0");
			elem = v.setMessage({text:"BIN是一个轻量的Web APP框架，BIN的目的是让Web APP的开发像Native APP开发一样。BIN基于Cordova，支持Android和IOS平台。"});
			elem.css("text-align", "left");
			v.addButton({text:"确定", onClick:function(v){v.close()}});
		}

		Class.multipleAlert = function()
		{
			bin.hudManager.alertInfo("这是Alert1");
			bin.hudManager.alertInfo("这是Alert2", "你好");
			bin.hudManager.alertInfo("这是Alert3");
		}

		return Base.extend(Class);
	}
);