define(
	["common/demoView", "bin/util/osUtil", "bin/common/indicatorView"],
	function(Base, osUtil, IndicatorView)
	{
		var Class = {};

		Class.events = 
		{
			"click #button" : "onClick"
		};

		Class.genHTML = function()
		{
			Base.prototype.genHTML.call(this);

			var indicatorView = new IndicatorView();
			this.$append("#block0", indicatorView.$());
			indicatorView.start();

			var self = this;
			osUtil.delayCall(function()
			{	
				self.$html("#block0Desc", "Loading Done");
				indicatorView.stop();
				indicatorView.remove();
			}, 3000);


			var indicatorView1 = new IndicatorView();
			this.$append("#block2", indicatorView1.$());
			
			var id0 = indicatorView1.start();
			var id1 = indicatorView1.start();

			var self = this;
			osUtil.delayCall(function()
			{	
				self.$html("#block2Desc", "stop第一次,indicator还不会消失");
				indicatorView1.stop(id0);
				osUtil.delayCall(function()
				{
					self.$html("#block2Desc", "stop第二次,indicator消失");
					indicatorView1.stop(id1);
					indicatorView1.remove();
				}, 2000);
			}, 2000);

			
		}

		Class.onClick = function()
		{
			this.$html("#button", "点击屏蔽");

			var indicatorView = new IndicatorView();
			this.$append("#block1", indicatorView.$());
			indicatorView.start({model:true});
			
			var self = this;
			osUtil.delayCall(function()
			{	
				self.$html("#button", "点我");
				indicatorView.stop();
			}, 5000);
		}

		return Base.extend(Class);
	}
);