define(
	["backbone", "underscore", "butterfly/extend"],
function(Backbone, _, extend)
{
	var ImageSet = function()
	{
		this._loadingImages = {};
		this._loadedImages = {};
	}

	ImageSet.extend = extend;

	var cls = {};

	cls.init = function(images)
	{
		if(images)
		{
			this.addImages(images);
		}
	}

	cls.addImages = function(images)
	{
		var self = this;

		_.each(images, function(image)
		{
			self.addImage(image);
		});
	}

	cls.addImage = function(image)
	{
		var name = image.name;
		if(this._loadedImages[name])
		{
			return ;
		}

		if(this._loadedImages[name])
		{
			return ;
		}

		var res = {name:name, path:image.path};
		this._loadingImages[name] = res;

		var img = new Image();
		img.src = res.path;
		res.img = img;

		var self = this;
		img.onload = function()
        {
        	self._onload(name);
        }

        img.onerror = function()
        {
        	self._onerror(name);
        }
	}

	cls.getImage = function(name)
	{
		var res = this._loadedImages[name];
		return res ? res.img : null;
	}

	cls._onload = function(name)
	{
		var res = this._loadingImages[name];
		this._loadedImages[name] = res;
        this._loadingImages[name] = null;

        this.trigger("onload", name, res.img);
	}

	cls._onerror = function(name)
	{
		this._loadingImages[name] = null;

        this.trigger("onerror", name);
	}

	_.extend(ImageSet.prototype, Backbone.Events);
	_.extend(ImageSet.prototype, cls);

	return ImageSet;
});