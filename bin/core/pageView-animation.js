define(["css!bin/res/css/pageViewAnimation"], function()
{
    var animations = 
    [
      'slideInLeft', 'slideInRight', 'slideOutLeft', 'slideOutRight', 'fadeIn', 'fadeOut'
    ];

    var Class = {};

    Class.animate = function(name, onFinish)
    {
        var self = this;
        var css  = 'animated '+name;
        this.getRoot().addClass(css);
        this.getRoot().one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
        { 
            self.getRoot().removeClass(css);
            if(onFinish)
            {
                onFinish();
            }
        });
    }

    var funName = null;
    var genAnimateFunc = function(name)
    {
        return function(onFinish)
        {
          this.animate(name, onFinish);
        }
    }
    for(var i=0,i_sz=animations.length; i<i_sz; ++i)
    {
        var aniName = animations[i];
        funName = 'animate' + aniName.charAt(0).toUpperCase() + aniName.substring(1);
        Class[funName] = genAnimateFunc(aniName);
    }
    
    return Class;
});
