({
    baseUrl: ".",
    paths: {
        	// 3rdParty path
			"3rdParty" : "bin/3rdParty",
			
			// equirejs plugins
			text: 'bin/3rdParty/requirejs-text/text',
			domReady: 'bin/3rdParty/requirejs-domready/domReady',
			i18n: 'bin/3rdParty/requirejs-i18n/i18n',
			css: 'bin/3rdParty/require-css/css',
			view: 'bin/requirePlugin/requirejs-view',
			map: 'bin/requirePlugin/requirejs-map',

			// 3rdParty libs
			jquery: 'bin/3rdParty/jquery/jquery',
			underscore: 'bin/3rdParty/underscore/underscore',
			backbone: 'bin/3rdParty/backbone/backbone',
			fastclick: 'bin/3rdParty/fastclick/fastclick',
			iscroll: 'bin/3rdParty/iscroll/iscroll-probe',
			swiper: 'bin/3rdParty/swiper/swiper',
			md5: 'bin/3rdParty/md5/md5',
			lzstring: "bin/3rdParty/lz-string/lz-string",
			lsloader: "bin/3rdParty/requirejs-lsloader/lsloader",
			prloader: "bin/3rdParty/requirejs-prloader/prloader"

    },
    exclude:
    ['css','swiper',  'domReady', 'text', 'iscroll', 'fastclick', 'prloader', 'lsloader', 'lzstring', 'jquery', 'underscore', 'backbone', 'config/netLocalConfig'],
    include:[
    // core
    'view',
    'map',
    'bin/core/application', 
    'bin/core/spaApplication', 
    'bin/core/main',
    'bin/core/classHierarchyLoader',
    'bin/core/netManager',
    'bin/core/hudManager',
    'bin/core/navigationController', 
    'bin/core/debugManager',
    'bin/core/dataCenter',
    'bin/core/mapManager',
    'bin/core/view',
    'bin/core/pageView',
    'bin/core/pageView-animation',
    'bin/core/naviPageView',
    'bin/core/navigationController-ioEffecters',
    'bin/core/netPolicy/netCachePolicy',
    'bin/core/netPolicy/netCallbackPolicy',
    'bin/core/netPolicy/netDebugPolicy',
    'bin/core/netPolicy/netSendCheckPolicy',

    // common
    'bin/common/hudView',
    'bin/common/alertView',
    'text!bin/common/alertView.html',
    'css!bin/common/alertView.css',
    'bin/common/selectView',
    'text!bin/common/selectView.html',
    'css!bin/common/selectView.css',
    'bin/common/dataProvider',
    'bin/common/datePickerView',
    'text!bin/common/datePickerView.html',
    'css!bin/common/datePickerView.css',
    'bin/common/imageSet',
    'bin/common/indicatorView',
    'text!bin/common/indicatorView.html',
    'css!bin/common/indicatorView.css',
    'bin/common/itemProvider',
    'bin/common/lazyLoadView',
    'bin/common/listView',
    'bin/common/refreshFooterView',
    'text!bin/common/refreshFooterView.html',
	'bin/common/refreshHeaderView',
	'text!bin/common/refreshHeaderView.html',
    'bin/common/scrollView',
	'bin/common/refreshView',
	'bin/common/statusView',
	'text!bin/common/statusView.html',
	'css!bin/common/statusView.css',
	'bin/common/swipeView',
	'bin/common/tabBarView',
	'bin/common/tabView',

	// debug
	'bin/debug/debugView',
	'text!bin/debug/debugView.html',

	// native
	'bin/native/nativeManager',
	'bin/native/nativePageView',

	// res
	'text!bin/res/html/defaultNaviBar.html',

	// util
	'bin/util/disUtil',
	'bin/util/elemUtil',
	'bin/util/fastclickUtil',
	'bin/util/lsUtil',
	'bin/util/osUtil',
	'bin/util/pathUtil',
	'bin/util/ssUtil'
    ],
    out: "bin/bin.js"
})