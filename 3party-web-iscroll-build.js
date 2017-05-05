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
    include:['iscroll'],
    out: "bin/3party-web-iscroll.js",
})