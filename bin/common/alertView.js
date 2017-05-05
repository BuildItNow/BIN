define(["bin/common/hudView"], 
function(Base)
{
	var Class = 
	{
		
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
				if(options.buttons.length === 2)
				{
					this._wrap2Button(options.buttons[0], options.buttons[1]);
				}
				else
				{
					for(var i=0,i_sz=options.buttons.length; i<i_sz; ++i)
					{
						this.addButton(options.buttons[i]);
					}
				}
			}
		}
	}

	Class.genHTML = function()
	{
		Base.prototype.genHTML.call(this);
	}

	Class.asyncPosGenHTML = function()
	{
		var top = (this.$().height()-this.$("#contentBlock").height())*0.5;
		this.$("#contentBlock").css("top", top+"px");
		this.$().hide().fadeIn(100).css("top", "0px");
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
		this.$append("#buttons", '<div class="AlertView-line"></div>');

		var elem = $('<div class="AlertView-button">'+button.text+'</div>');
		if(!button.onClick)
		{
			button.onClick = function(view, value)
			{
				view.close();
			}
		}
		elem.on("click", function(e){button.onClick(self, button.text)});
		
		if(button.color)
		{
			elem.css("color", button.color);
		}

		this.$append("#buttons", elem);

		return elem;
	}

	Class._wrap2Button = function(button0, button1)
	{
		if(!button0.onClick)
		{
			button0.onClick = function(view, value)
			{
				view.close();
			}
		}

		if(!button1.onClick)
		{
			button1.onClick = function(view, value)
			{
				view.close();
			}
		}

		var self = this;
		this.$append("#buttons", '<div class="AlertView-line"></div>');

		var elemWrap = $('<div class="AlertView-wrap-block"></div>');
		var elem     = $('<div class="AlertView-wrap-button">'+button0.text+'</div>');
		elem.on("click", function(e){button0.onClick(self, button0.text)});
		
		if(button0.color)
		{
			elem.css("color", button0.color);
		}
		elemWrap.append(elem);
		elem = $('<div class="AlertView-wrap-button">'+button1.text+'</div>');
		elem.on("click", function(e){button1.onClick(self, button1.text)});
		
		if(button1.color)
		{
			elem.css("color", button1.color);
		}
		elemWrap.append(elem);
		elemWrap.append("<div class='AlertView-v-line'></div>");
		
		this.$append("#buttons", elemWrap);
	}

	return Base.extend(Class, {view:"bin/common/alertView.html", style:"bin/common/alertView.css"});
});