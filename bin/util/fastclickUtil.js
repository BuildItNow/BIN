//override the notNeeded function of FastClick
//in order to emmet the click event on Android Mobile Chrome (or Chrome-Core envrionment), and Chrome Desktop with touch emulation
define(['fastclick'], function(FastClick){

  FastClick.notNeeded = function(layer) {
    'use strict';
    var metaViewport;
    var chromeVersion;

    // Devices that don't support touch don't need FastClick
    if (typeof window.ontouchstart === 'undefined') {
      return true;
    }

    // Chrome version - zero for other browsers
    chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

    if (chromeVersion) {

      if (deviceIsAndroid) {
        metaViewport = document.querySelector('meta[name=viewport]');

        if (metaViewport) {
          // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
            //patch here
            return false;
          }
          // Chrome 32 and above with width=device-width or less don't need FastClick
          if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
            //patch here
            return false;
          }
        }

      // Chrome desktop doesn't need FastClick (issue #15)
      } else {
        //patch here
        return false;
      }
    }

    // IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
    if (layer.style.msTouchAction === 'none') {
      return true;
    }

    return false;
  };

  return FastClick;
});
