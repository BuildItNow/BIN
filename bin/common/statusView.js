define(["text!bin/common/statusView.html", "css!bin/common/statusView.css", "bin/core/view", "bin/util/osUtil", "bin/util/disUtil"], 
function(html, css, Base, osUtil, disUtil)
{
	var Class = 
	{
		html:html,
	};

	Class.constructor = function(options)
	{	
		Base.prototype.constructor.call(this, options);

		this.$html(null, options.text);
	}

	Class.asyncPosGenHTML = function()
	{
		var max = disUtil.rem2px(12);
		var min = disUtil.rem2px(6);

		var w = this.$().width();
		if(w > max)
		{
			w = max;
			this.$().css("width", w+"px");
			
		}
		else if(w < min)
		{
			w = min;
			this.$().css("width", w+"px");
		}

		this.$().css("bottom", (disUtil.rem2px(4)-this.$().height()*0.5)+"px");
		this.$().css("left", (disUtil.clientWidth-w)*0.5+"px");

		var self = this;
		osUtil.delayCall(function()
		{
			self.$().fadeOut(200, function(){self.remove()});
		}, 2000);

		this.$().fadeIn(200);
	}

	return Base.extend(Class);
});