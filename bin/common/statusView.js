define(["text!bin/common/statusView.html", "css!bin/common/statusView.css", "bin/core/view"], 
function(html, css, Base)
{
	var Class = 
	{

	};

	Class.constructor = function(options)
	{	
		Base.prototype.constructor.call(this, options);

		this.$html(null, options.text);
	}

	Class.asyncPosGenHTML = function()
	{
		var max = bin.app.rem2px(12);
		var min = bin.app.rem2px(6);

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

		this.$().css("bottom", (bin.app.rem2px(5)-this.$().height()*0.5)+"px");
		this.$().css("left", (bin.app.clientWidth()-w)*0.5+"px");

		var self = this;
		setTimeout(function()
		{
			self.$().fadeOut(200, function(){self.remove()});
		}, 2000);

		this.$().hide().fadeIn(200);
	}

	return Base.extend(Class, {html:html});
});