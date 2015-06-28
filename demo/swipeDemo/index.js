define(
	["common/demoView", "bin/common/swipeView"],
	function(Base, SwipeView)
	{
		var Class = 
		{
			events:
			{
				"click #showSlide2" : "onShowSlide2",
				"click #showSlide0" : "onShowSlide0",	
			}
		};

		Class.posGenHTML = function()
		{
			this._swipeView = new SwipeView({elem:this.$("#swipeView"), onChange:function(view, index){bin.hudManager.showStatus("page "+index);}});
		}

		Class.onShowSlide0 = function()
		{
			this._swipeView.setCurrent(0);
		}

		Class.onShowSlide2 = function()
		{
			this._swipeView.setCurrent(2);
		}

		Class.onRemove = function()
		{
			this._swipeView.remove();
		}

		return Base.extend(Class);
	} 
);