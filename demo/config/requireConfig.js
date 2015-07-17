define(
{
	packages : 
	[],
	paths: 
	{
		// 3rdParty path
		"3rdParty" : "bin/3rdParty",
		
		// equirejs plugins
		text: 'bin/3rdParty/requirejs-text/text',
		domReady: 'bin/3rdParty/requirejs-domready/domReady',
		i18n: 'bin/3rdParty/requirejs-i18n/i18n',
		css: 'bin/3rdParty/require-css/css',
		view: 'bin/requirePlugin/requirejs-view',

		// 3rdParty libs
		jquery: 'bin/3rdParty/jquery/jquery',
		zepto: 'bin/3rdParty/zepto/zepto',
		underscore: 'bin/3rdParty/underscore/underscore',
		backbone: 'bin/3rdParty/backbone/backbone',
		fastclick: 'bin/3rdParty/fastclick/fastclick',
		iscroll: 'bin/3rdParty/iscroll/iscroll-probe',
		moment: 'bin/3rdParty/moment/moment',
		spin: 'bin/3rdParty/spinjs/spin',
		swiper: 'bin/3rdParty/swiper/swiper',
		md5: 'bin/3rdParty/md5/md5',

		// Add your paths here
	},
	waitSeconds: 5,
	shim: 
	{
	}
});