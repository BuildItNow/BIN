define(["bin/core/view"], function(Base)
{
	var HUDID = 0;
	var Class = {};
	Class.render = function()
	{
		Base.prototype.render.call(this);
		
		this.hudid = ++HUDID;
		this.$().attr("data-hudid", this.hudid);

		bin.hudManager.onCreateHUDView(this);
	}

	Class.onRemove = function()
	{
		bin.hudManager.onRemoveHUDView(this);
	}

	Class.close = function()
	{
		var self = this;
		this.$().fadeOut(100, function(){self.remove();});
	}

	return Base.extend(Class);
});