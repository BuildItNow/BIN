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

		Class.onInAnimationBeg = function()
		{
			this._indicatorID = bin.hudManager.startIndicator({model:true});
		}

		Class.onInAnimationEnd = function()
		{
			bin.hudManager.stopIndicator(this._indicatorID);

			this.$html("#swipeView", '<div class="SwipeDemoView-swipe-slide">\
    			<div class="SwipeDemoView-swipe-background" style="background-image:url(./swipeDemo/img/0.jpeg)"></div>\
    		</div>\
    		<div class="SwipeDemoView-swipe-slide">\
    			<div class="SwipeDemoView-swipe-background" style="background-image:url(./swipeDemo/img/1.jpeg)"></div>\
    		</div>\
    		<div class="SwipeDemoView-swipe-slide">\
    			<div class="SwipeDemoView-swipe-background" style="background-image:url(./swipeDemo/img/2.jpeg)"></div>	\
    		</div>\
    		<div class="SwipeDemoView-swipe-slide">\
    			<div class="SwipeDemoView-swipe-background" style="background-image:url(./swipeDemo/img/3.jpg)"></div>\
    		</div>');

			this._swipeView = new SwipeView({elem:this.$("#swipeView"), onChange:
				function(view, index)
				{
					console.info("page "+index);
					bin.hudManager.showStatus("page "+index);
				}});
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