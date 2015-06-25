define(
	["common/demoView", "bin/common/swipeView"],
	function(Base, SwipeView)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			this._swipeView = new SwipeView({elem:this.$("#swipeView"), current:1, onChange:function(index){bin.hudManager.showStatus("page "+index);}});
		}

		return Base.extend(Class);
	} 
);