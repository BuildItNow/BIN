var bin = {};
require.config({baseUrl:'../'});
	// bin frame-work namespace
require(["bin/core/setupConfig"], function()
{
	require(['domReady!', 'bin/util/fastclickUtil', 'bin/core/main'],  function(domReady, fastclickUtil, main)
	{
		//ios7 issue fix
		if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) 
		{
  			$('html').addClass('ipad ios7');
		}
		//iOS scroll to top
		setTimeout(function() {window.scrollTo(0, 1);}, 0);

		//enable fastclick
		fastclickUtil.attach(document.body);

		//this will stop the page from scrolling without IScroll
		// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

		main();
	});
});