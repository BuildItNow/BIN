define(["bin/core/view", "text!bin/core/alertView.html", "bin/util/osUtil"], 
function(Base, html, osUtil)
{
	var Class = 
	{
		html:html
	};

	Class.constructor = function(options)
	{
		Base.prototype.constructor.call(this, options);
		if(options)
		{
			this.setTitle(options.title);
			this.setMessage(options.message);

			if(options.buttons)
			{
				for(var i=0,i_sz=options.buttons.length; i<i_sz; ++i)
				{
					this.addButton(options.buttons[i]);
				}
			}
		}

		// Avoid flick effect, asyncPosGenHTML will fix the position
		this.$("#contentBlock").css("top", "-100000px");
	}

	Class.setTitle = function(title)
	{
		var elem = this.$("#title");
		if(!title)
		{
			elem.hide();
		}
		else
		{
			elem.html(title.text);
			if(title.color)
			{
				elem.css("color", title.color);	
			}
			elem.show();
		}

		return elem;
	}

	Class.setMessage = function(message)
	{
		var elem = this.$("#message");	
		elem.html(message.text);
		if(message.color)
		{
			elem.css("color", message.color);
		}

		return elem;
	}

	Class.addButton = function(button)
	{
		var self = this;
		var elem = $('<div class="AlertView-line"></div><div class="AlertView-button">'+button.text+'</div>');
		if(button.onClick)
		{
			elem.on("click", function(e){button.onClick(self, button.title)});
		}
		if(button.color)
		{
			elem.css("color", button.color);
		}

		this.$append("#buttons", elem);

		return elem;
	}

	Class.close = function()
	{
		this.remove();
	}

	Class.asyncPosGenHTML = function()
	{
		console.info("Height "+this.$().height());
		console.info("Content "+this.$("#contentBlock").height());

		var top = (this.$().height()-this.$("#contentBlock").height())*0.5;
		this.$("#contentBlock").css("top", top+"px");
	}

	return Base.extend(Class);
});