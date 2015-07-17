define(
	["bin/core/naviPageView", "welcome/tutorialConfig"],
	function(Base, config)
	{
		var Class = {};

		Class.posGenHTML = function()
		{
			var template  = _.template(this.$html("#tutorialLinkTemplate"));
			var container = this.$fragment("#tutorialContainer");
			for(var i=0,i_sz=config.length; i<i_sz; ++i)
			{
				container.append(template({id:i,name:config[i].name,todo:config[i].todo}));
			}

			var self = this;
			container.find(".WelcomeView-tutorial-link").on("click", function(e)
			{
				self.onClickTutorial(config[e.currentTarget.id]);
			});

			container.setup();
		}

		Class.onClickTutorial = function(config)
		{
			if(config.todo)
			{
				bin.hudManager.showStatus("开发中...");
			}
			else
			{
				bin.naviController.push(config.path, config);
			}
		}

		return Base.extend(Class);
	}
);