define(
{
	baseUrl : '../',
	packages : 
	[],
	paths: 
	{
		// require.js plugins
		text: '3rdParty/requirejs-text/text',
		domReady: '3rdParty/requirejs-domready/domReady',
		i18n: '3rdParty/requirejs-i18n/i18n',
		css: '3rdParty/require-css/css',
		view: 'bin/requirePlugin/requirejs-view',

		// lib
		jquery: '3rdParty/jquery/jquery',
		zepto: '3rdParty/zepto/zepto',
		underscore: '3rdParty/underscore/underscore',
		backbone: '3rdParty/backbone/backbone',
		fastclick: '3rdParty/fastclick/fastclick',
		iscroll: '3rdParty/iscroll/iscroll-probe',
		moment: '3rdParty/moment/moment',
		spin: '3rdParty/spinjs/spin',
		swipe: '3rdParty/swipe/swipe',
	},
	waitSeconds: 5,
	shim: {
		iscroll: {exports: 'IScroll'},
	}
});