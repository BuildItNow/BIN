define(["text!bin/common/alertView.html", "css!bin/common/alertView.css", "bin/core/view", "bin/util/osUtil"], 
function(html, css, Base, osUtil)
{
	var zIndex = 1;

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
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);
		this.$().css("z-index", zIndex);
		++zIndex;

		// Avoid flick effect, asyncPosGenHTML will fix the position
		this.$("#contentBlock").css("top", "-100000px");
	}

	Class.asyncPosGenHTML = function()
	{
		var top = (this.$().height()-this.$("#contentBlock").height())*0.5;
		this.$("#contentBlock").css("top", top+"px");
		this.$().fadeIn(100);
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
			elem.on("click", function(e){button.onClick(self, button.text)});
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
		var self = this;
		this.$().fadeOut(100, function(){self.remove();});
	}

	return Base.extend(Class);
});