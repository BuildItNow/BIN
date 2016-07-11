define(
	["bin/core/view", "text!bin/common/indicatorView.html", "css!bin/common/indicatorView.css", "bin/core/util"],
	function(Base, html, css, util)
	{
		var Class = 
		{
		};

		Class.constructor = function(options)
		{
			this._style = options ? options.style : "dark";

			Base.prototype.constructor.call(this, options);

			this._lc = 0;
			this._mc  = 0;
			this._lv = 1;
			
			this.reset();
		}

		Class.posGenHTML = function()
		{
			this.$("#indicator").addClass(this._style === "dark" ? "bin-loading-dark-image" : "bin-loading-light-image");
		}

		Class.start = function(options)
		{
			if(!options)
			{
				options = {};
			}
			else
			{
				options = util.clone(options, true);
			}
			this._incLoading(options.model);
			options._lv = this._lv;

			return options;
		}

		Class.stop = function(id)
		{
			if(!id)
			{
				this.reset();

				return ;
			}

			if(id._lv < this._lv)
			{
				return ;
			}

			this._decLoading(id.model);
		}

		Class.reset = function()
		{
			this.hide();
			this.$().css("pointer-events", "none");
			this._lc = 0;
			this._mc = 0;
			
			++this._lv;
		}

		Class.running = function()
		{
			return this._lc > 0;
		}
			
		Class._incLoading = function(model) 
		{
			if(this._incLoadingCount() == 1)
			{
				this.show();
			}

			if(model)
			{
				if(this._incModelCount() == 1)
				{
					this.$().css("pointer-events", "auto");
				}
			}
		}

		Class._decLoading = function(model) 
		{
			if(this._decLoadingCount() == 0)
			{
				this.hide();
			}

			if(model)
			{
				if(this._decModelCount() == 0)
				{
					this.$().css("pointer-events", "none");
				}
			}
		}

		Class._incLoadingCount = function()
		{
			++this._lc;
			return this._lc;
		}

		Class._decLoadingCount = function()
		{
			--this._lc;
			this._lc = Math.max(this._lc, 0);
			
			return this._lc;
		}

		Class._incModelCount = function()
		{
			++this._mc;
			
			return this._mc;
		}

		Class._decModelCount = function()
		{
			--this._mc;
			this._mc = Math.max(this._mc, 0);
			
			return this._mc;
		}

		return Base.extend(Class, {html:html});
	}
);