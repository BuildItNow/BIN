define(["plupload"], function(plupload)
{
	var Class = {};

	Class.vmData = 
	{
		files : [],
		uploading : false,
	};

	Class.constructor = function(options)
	{
		this._singleSelection = options && options.singleSelection;
		this._api = options && options.api ? options.api : "api/public/file/upload";
		this._maxFileSize = options && options.maxFileSize ? options.maxFileSize : "10mb";
		this._fileTypes = options && options.fileTypes ? options.fileTypes : "jpg,gif,png,jpeg,zip,doc,docx,ppt,pptx,xlsx,xls,pdf";
 
		bin.ui.View.prototype.constructor.call(this, options);
	}

	Class.posGenHTML = function()
	{
		var self = this;
		this._uploader = new plupload.Uploader(
		{
			runtimes : "html5,flash,silverlight,html4",
			container : this.$()[0],
			browse_button : this.$("#browse_button")[0],
			url : bin.runtimeConfig.server+this._api,
			flash_swf_url : "3rdParty/plupload-2.3.1/js/Moxie.swf",
			silverlight_xap_url : "3rdParty/plupload-2.3.1/js/Moxie.xap",
			filters : 
			{
				max_file_size : this._maxFileSize,
				mime_types : 
				[
					{title : "支持文件类型", extensions : this._fileTypes},
				],
				prevent_duplicates : true,
			},

			init: {
				PostInit: function() 
				{
					
				},
				FilesAdded: function(up, files) 
				{
					self._onFilesAdded(files);
				},
				BeforeUpload: function(up, file)
				{
					if(self._singleSelection)
					{
						return self.vm.files[0] && file.id === self.vm.files[0].id;
					}

					return true;
				},
				UploadProgress: function(up, file) 
				{
					self._onFileUploading(file.id, file.percent);
				},
				FileUploaded: function(up, file, result)
				{
					self._onFileUploaded(file.id, result.status == 200 ? JSON.parse(result.response) : "");
				},
				UploadComplete: function(up, files)
				{
					self._onComplete();
				},
				Error: function(up, err) 
				{
					bin.hudManager.showStatus(err.message);
				},
				FilesRemoved: function(up, files) 
				{
					self._onFilesRemoved(files);
				},
			}
		});

		var e = this._uploader.init();
		if(e)
		{
			bin.hudManager.showStatus(e.message);
		}
	}

	Class.vmMethod_removeFile = function(id)
	{
		this._uploader.removeFile(id);
	}

	Class.startUpload = function()
	{
		if(!this.hasFiles())
		{
			return Promise.reject("No file");
		}

		this.vm.uploading = true;

		var self = this;
		this._promise = new Promise(function(resolve, reject)
		{
			self._doResolve = function(data)
			{
				resolve(data);
			}

			self._doReject = function(err)
			{
				reject(err);
			}
		});
		
		this._uploader.start();

		return this._promise;
	}

	Class.hasFiles = function()
	{
		return this.vm.files.length > 0;
	}

	Class._onFilesAdded = function(files)
	{	
		if(this._singleSelection)
		{
			this.vm.files = 
			[{
				name:files[0].name,
				id:files[0].id,
				percent:0,
				status:"none",
			}];
		}
		else
		{
			for(var i=0,i_sz=files.length; i<i_sz; ++i)
			{
				var file = files[i];
				this.vm.files.push(
					{
						name:file.name,
						id:file.id,
						percent:0,
						status:"none",
					});
			}
		}
	}

	Class._onFilesRemoved = function(files)
	{
		var removed = {};

		for(var i=0,i_sz=files.length; i<i_sz; ++i)
		{
			removed[files[i].id] = true;
		}

		files = this.vm.files;
		var lefted = [];
		for(var i=0,i_sz=files.length; i<i_sz; ++i)
		{
			if(!removed[files[i].id])
			{
				lefted.push(files[i]);
			}
		}

		this.vm.files = lefted;
	}

	Class._onFileUploading = function(id, percent)
	{
		var file = this._getFile(id);
		if(file)
		{
			file.percent = percent;
		}
	}

	Class._onFileUploaded = function(id, netData)
	{
		var file = this._getFile(id);
		if(!file)
		{
			return ;
		}

		file.percent = 100;

		if(!netData)
		{
			file.status = "fail";
		}
		else
		{
			if(netData.code != 0)
			{
				file.status = "fail";
				bin.hudManager.showStatus(netData.error);
			}
			else
			{
				file.status = "succeed";
				file.uuid = netData.data;
			}
		}
	}

	Class._onComplete = function()
	{
		this.vm.uploading = false;

		for(var i=0,i_sz=this.vm.files.length; i<i_sz; ++i)
		{
			var file = this.vm.files[i];
			if(!file.status || file.status === "none")
			{
				file.status = "fail";
				file.percent = 100;
			}
		}

		this._doResolve(this.vm.files);
		this._promise = null;
		this._doResolve = null;
		this._doReject  = null;
	}

	Class._getFile = function(id)
	{
		var i = 0;
		while(i<this.vm.files.length && this.vm.files[i].id !== id)
		{
			++i;
		}

		return i<this.vm.files.length ? this.vm.files[i] : null;
	}

	Class.onRemove = function()
	{
		this._uploader.destroy();
	}

	return bin.ui.View.extend(Class);
});