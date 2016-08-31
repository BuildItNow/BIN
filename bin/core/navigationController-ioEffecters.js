define(
	[],
function()
{
	var effecters = 
	{
		"nativeIO" :
		[
			// In
			function(curView, preView)
			{
				curView.show();
				//preView.hide();
			},
			// Out
			function(curView, preView)
			{
				preView.show();
				curView.hide();
				curView.remove();
			}
		],
		"nativeSSIO" :
		[
			// In
			function(curView, preView)
			{
				
			},
			// Out
			function(curView, preView)
			{
				preView.show();
				preView.animateSlideInLeft(function()
				{
					preView.show();
				});
				curView.animateSlideOutRight(function()
				{
					curView.hide();
					curView.remove();
				});
			}
		],
		"nativeSNIO" :
		[
			// In
			function(curView, preView)
			{
				
			},
			// Out
			function(curView, preView)
			{
				setTimeout(function()
				{
					preView.show();
					curView.hide();
					curView.remove();
				}, 500);
			}
		],
		"noIO" :
		[
			// In
			function(curView, preView, aniEnd)
			{
				curView.show();
				preView.hide();

				if(aniEnd)
				{
					setTimeout(function()
					{
						aniEnd();
					}, 0);
				}
			},
			// Out
			function(curView, preView)
			{
				preView.show();
				curView.hide();
				curView.remove();
			}
		],
		"fadeIO" :
		[
			// In
			function(curView, preView, aniEnd)
			{
				curView.show();
				curView.animateFadeIn(function()
				{
					preView.hide();
					curView.show();
					if(aniEnd)
					{
						aniEnd();
					}
				});
			},
			// Out
			function(curView, preView)
			{
				preView.show();
				curView.animateFadeOut(function()
				{
					curView.hide();
					curView.remove();
					preView.show();
				});
			}
		],
		"rightIO" :
		[
			// In
			function(curView, preView, aniEnd)
			{
				curView.$().addClass("prepareSlideInRight");
				curView.show();
				setTimeout(function()
				{
					curView.animateSlideInRight(function()
					{
						preView.hide();
						curView.$().removeClass("prepareSlideInRight");
						curView.show();

						if(aniEnd)
						{
							aniEnd();
						}
					});
				}, 30);
			},
			// Out
			function(curView, preView)
			{
				preView.show();
				setTimeout(function()
				{
					curView.animateSlideOutRight(function()
					{
						curView.hide();
						curView.remove();
						preView.show();
					});
				}, 30);
			}
		],
		"leftIO" :
		[
			// In
			function(curView, preView, aniEnd)
			{
				curView.$().addClass("prepareSlideInLeft");
				curView.show();
				setTimeout(function()
				{
					curView.animateSlideInLeft(function()
					{
						preView.hide();
						curView.$().removeClass("prepareSlideInLeft");
						curView.show();

						if(aniEnd)
						{
							aniEnd();
						}
					});
				}, 30);
			},
			// Out
			function(curView, preView)
			{
				preView.show();
				setTimeout(function()
				{
					curView.animateSlideOutLeft(function()
					{
						curView.hide();
						curView.remove();
						preView.show();
					});
				}, 30);
			}
		],
		"rightILeftO" :
		[
			// In
			function(curView, preView, aniEnd)
			{
				curView.$().addClass("prepareSlideInRight");
				curView.show();

				setTimeout(function()
				{
					preView.animateSlideOutLeft(function()
					{
						preView.hide();
					});
					curView.animateSlideInRight(function()
					{
						curView.$().removeClass("prepareSlideInRight");
						curView.show();

						if(aniEnd)
						{
							aniEnd();
						}
					});
				}, 30);
			},
			// Out
			function(curView, preView)
			{
				preView.show();
				setTimeout(function()
				{
					preView.animateSlideInLeft(function()
					{
						preView.show();
					});
					curView.animateSlideOutRight(function()
					{
						curView.hide();
						curView.remove();
					});
				}, 30);
			}
		]
	}


	return effecters;
});