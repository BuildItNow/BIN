define(["text!bin/common/datePickerView.html", "css!bin/common/datePickerView.css", "bin/common/hudView", "bin/util/osUtil", "iscroll", "bin/util/disUtil"], 
function(html, css, Base, osUtil, iscroll, disUtil)
{
	var DEFAULT_OPTIONS = 
	{
		pickDate:true,
		pickTime:false,
		yearBeg:1980,
		yearEnd:2030,
	};

	var MONTH_DAYS = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var isLeapYear = function(year)
	{
		return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0
	}
	
	var Class = {};

	Class.constructor = function(options)
	{
		options = options || {};
		_.defaults(options, DEFAULT_OPTIONS);

		if(!options.date)
		{
			options.date = new Date();
		}

		this._options = options;

		this._scrollers  = {};
		this._picks      = {};
		this._containers = {};

		Base.prototype.constructor.call(this, options);
	}

	Class.posGenHTML = function()
	{
		if(this._options.pickTime)
		{
			this._initTime();
		}
		else
		{
			this.$("#timeBlock").hide();
		}

		if(this._options.pickDate)
		{
			this._initDate();
		}
		else
		{
			this.$("#title").html("请选择时间");
			this.$("#dateBlock").hide();
		}

		var self = this;

		this.$("#confirm").on("click", function(){self._onConfirm()});
		this.$("#cancel").on("click", function(){self.close()});
		_.forEach(this._containers, function(container, key)
		{
			container.find("#i"+self._picks[key]).addClass("DatePickerView-picked");
		});
	}

	Class._initDate = function()
	{
		var f = this.$fragment("#year");
		f.append("<li></li>");
		for(var i=this._options.yearBeg,i_sz=this._options.yearEnd+1;i<i_sz; ++i)
		{
			f.append("<li id='i"+i+"'>"+i+"</li>");
		}
		f.append("<li></li>");
		f.setup();
		this._containers.year = f.holder();

		var f = this.$fragment("#month");
		f.append("<li></li>");
		for(var i=1,i_sz=12+1;i<i_sz; ++i)
		{
			f.append("<li id='i"+i+"'>"+(i < 10 ? "0"+i : i)+"</li>");
		}
		f.append("<li></li>");
		f.setup();
		this._containers.month = f.holder();

		var f = this.$fragment("#day");
		f.append("<li></li>");
		for(var i=1,i_sz=31+1;i<i_sz; ++i)
		{
			f.append("<li id='i"+i+"'>"+(i < 10 ? "0"+i : i)+"</li>");
		}
		f.append("<li></li>");

		f.setup();
		this._containers.day = f.holder();

		var year  = this._options.date.getFullYear();
		year = Math.min(year, this._options.yearEnd);
		year = Math.max(year, this._options.yearBeg);

		var month = this._options.date.getMonth()+1;
		var day   = this._options.date.getDate();

		this._picks.year  = year;
		this._picks.month = month;
		this._picks.day   = day;

		var mc = MONTH_DAYS[month];
		if(month === 2)
		{
			mc = isLeapYear(year) ? 29 : 28;
		}

		for(var i=mc+1, i_sz=31+1; i<i_sz; ++i)
		{
			this._containers.day.find("#i"+i).hide();
		}
	}

	Class._initTime = function()
	{
		var f = this.$fragment("#hour");
		f.append("<li></li>");
		for(var i=0,i_sz=23+1;i<i_sz; ++i)
		{
			f.append("<li id='i"+i+"'>"+(i < 10 ? "0"+i : i)+"</li>");
		}
		f.append("<li></li>");

		f.setup();
		this._containers.hour = f.holder();

		var f = this.$fragment("#minute");
		f.append("<li></li>");
		for(var i=0,i_sz=59+1;i<i_sz; ++i)
		{
			f.append("<li id='i"+i+"'>"+(i < 10 ? "0"+i : i)+"</li>");
		}
		f.append("<li></li>");

		f.setup();
		this._containers.minute = f.holder();

		var f = this.$fragment("#second");
		f.append("<li></li>");
		for(var i=0,i_sz=59+1;i<i_sz; ++i)
		{
			f.append("<li id='i"+i+"'>"+(i < 10 ? "0"+i : i)+"</li>");
		}
		f.append("<li></li>");

		f.setup();
		this._containers.second = f.holder();

		this._picks.hour   = this._options.date.getHours();
		this._picks.minute = this._options.date.getMinutes();
		this._picks.second = this._options.date.getSeconds();
	}

	Class._onConfirm = function()
	{
		if(this._options.onPick)
		{
			var date = new Date();

			if(this._options.pickDate)
			{
				date.setFullYear(this._picks.year);
				date.setMonth(this._picks.month-1);
				date.setDate(this._picks.day);
			}

			if(this._options.pickTime)
			{
				date.setHours(this._picks.hour);
				date.setMinutes(this._picks.minute);
				date.setSeconds(this._picks.second);
			}

			this._options.onPick(date);
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
		c.find("#i"+o).removeClass("DatePickerView-picked");
		
		this._picks[name] = val;

		c.find("#i"+val).addClass("DatePickerView-picked");

		if(name === "year")
		{
			this._onYearChange(o, val);

			return ;
		}

		if(name === "month")
		{
			this._onMonthChange(o, val);
		}
	}

	Class._onYearChange = function(o, n)
	{
		if(o === n)
		{
			return ;
		}

		var m = this._picks.month
		if(m !== 2)
		{
			return ;
		}

		var ol = isLeapYear(o);
		var nl = isLeapYear(n);

		if(ol === nl)
		{
			return ;
		}

		var c = this._containers.day
		var el = c.find("#i29");
		if(nl)
		{
			el.show();
		}
		else
		{
			el.hide();
		}

		var day = this._picks.day;
		var scroller = this._scrollers.day;
		if(day === 29)
		{
			el.removeClass("DatePickerView-picked");
			c.find("#i28").addClass("DatePickerView-picked");
			this._picks.day = 28;
			day = 28;
		}

		osUtil.nextTick(function()
		{
			scroller.refresh();
			scroller.scrollToElement("#i"+day, 0, false, true);
		});
	}

	Class._onMonthChange = function(o, n)
	{
		if(o === n)
		{
			return ;
		}

		var omc = MONTH_DAYS[o];
		var nmc = MONTH_DAYS[n];
		if(omc === nmc && o !== 2 && n !== 2)
		{
			return ;
		}

		if(o === 2)
		{
			omc = isLeapYear(this._picks.year) ? 29 : 28;
		}
		if(n === 2)
		{
			nmc = isLeapYear(this._picks.year) ? 29 : 28;
		}
		var c = this._containers.day

		if(omc > nmc) // Hide
		{
			for(var i=nmc+1,i_sz=omc+1; i<i_sz; ++i)
			{
				c.find("#i"+i).hide();
			}
		}
		else
		{
			for(var i=omc+1,i_sz=nmc+1; i<i_sz; ++i)
			{
				c.find("#i"+i).show();
			}
		}

		var day = this._picks.day;
		if(day > nmc)
		{
			var el = c.find("#i"+day).removeClass("DatePickerView-picked");
			this._picks.day = nmc;
			day = nmc;
			c.find("#i"+day).addClass("DatePickerView-picked");
		}
		var scroller = this._scrollers.day;
		osUtil.nextTick(function()
		{
			scroller.refresh();
			scroller.scrollToElement("#i"+day, 0, false, true);
		});

	}

	Class.asyncPosGenHTML = function()
	{
		var top = (this.$().height()-this.$("#contentBlock").height())*0.5;
		this.$("#contentBlock").css("top", top+"px");
		this.$().hide().fadeIn(100).css("top", "0px");

       var scrollOptions = {snap:"li", noFlick:true, alwaysScrollY:true, bounce:true, bounceTime:200,  useTransition:false, mouseWheel:false};

		if(this._options.pickDate)
		{
			this._scrollers.year  = new IScroll(this.$("#yearWrapper")[0], scrollOptions);
			this._scrollers.year.beg   = this._options.yearBeg;
			this._scrollers.month = new IScroll(this.$("#monthWrapper")[0], scrollOptions);
			this._scrollers.month.beg   = 1;
			this._scrollers.day   = new IScroll(this.$("#dayWrapper")[0], scrollOptions);
			this._scrollers.day.beg   = 1;

		}

		if(this._options.pickTime)
		{
			this._scrollers.hour   = new IScroll(this.$("#hourWrapper")[0], scrollOptions);
			this._scrollers.hour.beg = 0;
			this._scrollers.minute = new IScroll(this.$("#minuteWrapper")[0], scrollOptions);
			this._scrollers.minute.beg = 0;
			this._scrollers.second = new IScroll(this.$("#secondWrapper")[0], scrollOptions);
			this._scrollers.second.beg = 0;
		}

		var self = this;
		var ITEM_HEIGHT = disUtil.rem2px(1.5);
		var WRAPPER_HEIGHT = disUtil.rem2px(4.5);
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