/*
 * bitnow-cli auto generate
 */

define(
[
"bin/common/hudView"
], 
function(Super)
{
    var Class = 
    {
        
    };

    Class.constructor = function(options)
    {
        Super.prototype.constructor.call(this, options);
        if(options)
        {
            this.setTitle(options.title);
            this.setMessage(options.message);

            if(options.buttons)
            {
                var elem = null;
                for(var i=0,i_sz=options.buttons.length; i<i_sz; ++i)
                {
                    elem = this.addButton(options.buttons[i]);
                    if(i === 0)
                    {
                        elem.addClass("btn-primary");
                    }
                    else
                    {
                        elem.addClass("btn-default");
                    }
                }
            }

            var self = this;
            this.$(".close").on("click", function()
            {
                self.close();
            });

        }

        this.$().fadeIn(100);
    }

    Class.setTitle = function(title)
    {
        var elem = this.$("#title");
        if(!title)
        {
            elem.hide();
        }
        else
        {
            elem.html(title.text);
            if(title.color)
            {
                elem.css("color", title.color); 
            }
            elem.show();
        }

        return elem;
    }

    Class.setMessage = function(message)
    {
        var elem = this.$("#message");  
        elem.html(message.text);
        if(message.color)
        {
            elem.css("color", message.color);
        }

        return elem;
    }

    Class.addButton = function(button)
    {
        var self = this;
        
        var elem = $('<button class="btn btn-sm">'+button.text+'</button>');
        elem.on("click", function(e)
        {
            if(!button.onClick || !button.onClick(self, button.text))
            {
                self.close();
            }
        });
        
        if(button.color)
        {
            elem.css("color", button.color);
        }

        this.$append("#buttons", elem);

        return elem;
    }

    return Super.extend(Class);
});