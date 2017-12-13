/*
 * bitnow-cli auto generate
 */

define(
[], 
function()
{
	var Super = bin.ui.View;
	var Class = {};

    Class.constructor = function(options)
    {
        Super.prototype.constructor.call(this, options);

        this.$append(null, options.text);

        this.$().fadeIn(200);

        var self = this;
        setTimeout(function()
        {
            self.$().fadeOut(200, function(){self.remove()});
        }, 2000);
    }


	return Super.extend(Class);
});