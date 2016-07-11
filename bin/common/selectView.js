define(["text!bin/common/selectView.html", "css!bin/common/selectView.css", "bin/common/hudView", "iscroll"], 
function(html, css, Base, iscroll)
{
	var Class = {};

	Class.constructor = function(options)
	{
		options = options ? options : {};
		this._options = options;
		this._scrollers  = {};
		this._picks      = {};
		this._containers = {};
		Base.prototype.constructor.call(this, options);
	}
	Class.events = {
		'click #options li':'selectOpt'
	}

	Class.posGenHTML = function()
	{
		this._initDate();

		var self = this;
		this.$().on("click", function(event)
		{
			var id = event.target.id;
			if(id ==="selectView" || id === "cancel")
			{
				self.close();
			}
			else if(id === "confirm")
			{
				self._onConfirm();
			}
		});

		_.forEach(this._containers, function(container, key)
		{
			container.find("#i"+self._picks[key]).addClass("SelectView-picked");
		});
	}
	Class.selectOpt = function(event)
	{
		var self = this;
		value = event.currentTarget.getAttribute("data-value");
		if(value === undefined || value === null)
		{
			return ;
		}

		var index = this.valueToindex(value);

		if(index === this._picks.opt)
		{
			return ;
		}

		var ITEM_HEIGHT = bin.app.rem2px(1.5);
		var WRAPPER_HEIGHT = bin.app.rem2px(4.5);

		this._scrollers.opt.scrollTo(0, -(index+1+0.5)*ITEM_HEIGHT+WRAPPER_HEIGHT*0.5, 100*Math.abs(index-this._picks.opt));
		

	}
	Class.valueToindex=function(value)
	{
		for(var i=0,i_sz=this._options.options.length; i<i_sz; ++i)
		{
			if(this._options.options[i].value===value)
			{
				return i;
			}
		}

		return 0;
	}
	Class._initDate = function()
	{	
		var self=this;
		//console.log(this._options);
		var f = self.$fragment("#options");
		var len=self._options.options.length;
		f.append("<li></li>");
		for(var i=0;i<len; i++)
		{
			f.append("<li id='i"+i+"' class="+self._options.options[i].value+" data-value="+self._options.options[i].value+">"+self._options.options[i].text+"</li>");
		}
		f.append("<li></li>");
		f.setup();
		this._containers.opt = f.holder();
		this._picks.opt = this.valueToindex(this._options.current);
	}
	Class._onConfirm = function()
	{
		if(this._options.callback)
		{
			var value=self.$('.SelectView-picked').attr('data-value');
			var text=self.$('.SelectView-picked').text();
			this._options.callback({text:text,value:value});
		}

		this.close();
	}

	Class._onPick = function(name, val)
	{
		var c = this._containers[name];
		var o = this._picks[name];
		var s = this._scrollers[name];
		
		if(o === val)
		{
			return ;
		}
		c.find("#i"+o).removeClass("SelectView-picked");
		
		this._picks[name] = val;

		c.find("#i"+val).addClass("SelectView-picked");
	}
	Class.asyncPosGenHTML = function()
	{
		var height = this.$().height();
		var top = height-bin.app.rem2px(8);
		this.$("#contentBlock").css("top", height+"px");
		this.$().hide().fadeIn(100).css("top", "0px");

		this.$("#contentBlock").animate({top: top},200);
       	var scrollOptions = {snap:"li", noFlick:true, alwaysScrollY:true, bounce:true, bounceTime:200,  useTransition:false, mouseWheel:false};
			this._scrollers.opt  = new IScroll(this.$("#optWrapper")[0], scrollOptions);
			this._scrollers.opt.beg   = 0;
			
		var self = this;
		var ITEM_HEIGHT = bin.app.rem2px(1.5);
		var WRAPPER_HEIGHT = bin.app.rem2px(4.5);
		_.forEach(this._scrollers, function(scroller, key)
		{
			scroller.scrollToElement("#i"+self._picks[key], 0, false, true);
			
			scroller.on("scrollEnd", function()
			{	
				var idx = parseInt((-scroller.y+WRAPPER_HEIGHT*0.5-ITEM_HEIGHT)/ITEM_HEIGHT);

				self._onPick(key, scroller.beg+idx);
			});
		});
	}

	return Base.extend(Class, {html:html});
});