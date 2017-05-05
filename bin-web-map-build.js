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
            //jquery: 'bin/3rdParty/zepto/zepto',
			jquery: 'bin/3rdParty/jquery/jquery',
			underscore: 'bin/3rdParty/underscore/underscore',
			backbone: 'bin/3rdParty/backbone/backbone',
			fastclick: 'bin/3rdParty/fastclick/fastclick',
			iscroll: 'bin/3rdParty/iscroll/iscroll-probe',
			swiper: 'bin/3rdParty/swiper/swiper',
			md5: 'bin/3rdParty/md5/md5',
			lzstring: "bin/3rdParty/lz-string/lz-string",
			lsloader: "bin/3rdParty/requirejs-lsloader/lsloader",
			prloader: "bin/3rdParty/requirejs-prloader/prloader",
            vue:"bin/3rdParty/vue/vue",
    },
    exclude:
    [

        // 3party
        'vue', 'css','swiper',  'domReady', 'text', 'iscroll', 'fastclick', 'prloader', 'lsloader', 'lzstring', 'jquery', 'underscore', 'backbone', 'config/netLocalConfig',

        // core
        'view',
        'bin/core/application', 
        'bin/web/core/webApplication', 
        'bin/web/core/main',
        'bin/web/core/viewManager',
        'bin/core/classHierarchyLoader',
        'bin/core/netManager',
        'bin/core/dataCenter',
        'bin/core/view',
        'bin/core/netPolicy/netCachePolicy',
        'bin/core/netPolicy/netCallbackPolicy',
        'bin/core/netPolicy/netDebugPolicy',
        'bin/core/netPolicy/netSendCheckPolicy',
        'bin/common/lazyLoadView',
    	'bin/core/util',
        
        // mobile
        'bin/web/core/mpaApplication', 
        'bin/web/core/naviPageView',
        'bin/core/hudManager',
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
        'bin/common/indicatorView',
        'text!bin/common/indicatorView.html',
        'css!bin/common/indicatorView.css',
        'bin/common/statusView',
    	'text!bin/common/statusView.html',
    	'css!bin/common/statusView.css',
    	'text!bin/res/html/defaultNaviBar.html',
    ],
    include:
    [
        // map 
        'map',
        'bin/core/mapManager',
    ],
    out: "bin/bin-web-map.js"
})