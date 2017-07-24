define(["bin/core/view"], function(View)
{
	var Class = {};

	Class.constructor = function(options)
	{
		options = options || {};
		options.elemParent = $("body");
		
		this._dialogOptions = {show:true, backdrop:"static"};

		if(options.backdrop !== undefined)
		{
			this._dialogOptions.backdrop = options.backdrop;
		}

		if(options.keyboard !== undefined)
		{
			this._dialogOptions.keyboard = options.keyboard;
		}

		this._onSubmit = options.onSubmit;
		this._onCancel = options.onCancel;
 		
		View.prototype.constructor.call(this, options);
	}

	Class.asyncPosGenHTML = function()
	{
		var self = this;

		this.$().modal(this._dialogOptions).on("hidden.bs.modal", function()
		{
			View.prototype.remove.call(self);
		});
	}

	Class.vmMethod_submit = function()
	{
		if(!this._onSubmit)
		{
			this.close();

			return ;
		}

		var nc = false;
		if(arguments.length > 0)
		{
			nc = this._onSubmit.apply(null, [this].concat(arguments));
		}
		else
		{
			nc = this._onSubmit.call(null, this);
		}

		if(!nc)
		{
			this.close();
		}
	}

	Class.vmMethod_cancel = function()
	{
		if(!this._onCancel)
		{
			this.close();

			return ;
		}

		var nc = false;
		if(arguments.length > 0)
		{
			nc = this._onCancel.apply(null, [this].concat(arguments));
		}
		else
		{
			nc = this._onCancel.call(null, this);
		}
		
		if(!nc)
		{
			this.close();
		}
	}

	Class.close = function()
	{
		this.remove();
	}

	Class.remove = function()
	{
		this.$().modal("hide");
	}


	return View.extend(Class);
});