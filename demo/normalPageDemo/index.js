define(
	["bin/core/pageView"],
	function(Base)
	{
		var Class = {};

		// Backbone 方式绑定事件
		Class.events = 
		{
		};

		// 在genHTML动态添加HTML或者element前调用
		Class.preGenHTML = function()
		{
			console.info("NORMAL_PAGE_DEMO : preGenHTML");
		}

		// 动态添加HTML或者element在这里添加
		Class.genHTML = function()
		{
			Base.prototype.genHTML.call(this);

			this.$html("#helloContent", _.template(this.$html("#helloTemplate"), {desc:"该示例将展示一个pageView如何开发,请参看该页面开发代码的注释,参看本页面的console查看页面回调的执行顺序。"}));			
		
			console.info("NORMAL_PAGE_DEMO : genHTML");
		}

		// 在genHTML动态添加HTML或者element后调用，一些添加节点事件的代码在这里编写
		Class.posGenHTML = function()
		{
			console.info("NORMAL_PAGE_DEMO : posGenHTML");
		
			var self = this;
			this.$("#goBack").on("click", function(){self.goBack()});
		}

		// 针对posGenHTML的异步版本，一些需要当本页面渲染过后执行的代码在这里编写
		Class.asyncPosGenHTML = function()
		{
			console.info("NORMAL_PAGE_DEMO : asyncPosGenHTML");
		}

		// 该页面显示的时候被调用
		Class.onShow = function()
		{
			console.info("NORMAL_PAGE_DEMO : onShow");
		}

		// 该页面隐藏的时候被调用
		Class.onHide = function()
		{
			console.info("NORMAL_PAGE_DEMO : onHide");
		}

		// 该页面被移除的时候被调用（该页面会被移除整个DOM树），一些释放性代码在这里编写
		Class.onRemove = function()
		{
			console.info("NORMAL_PAGE_DEMO : onRemove");
		}

		return Base.extend(Class);
	}
);