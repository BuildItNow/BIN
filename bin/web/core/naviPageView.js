define(
        [
            "text!bin/res/html/defaultNaviBar.html",
            "bin/core/view",
        ],
        function (defaultNavigationTemplate, View)
        {
            var DEFAULT_NAVIBACK_IMAGE = bin.globalConfig.navibackImage || "bin/res/img/bpf_hash_back.png";

            var Base = View;
            
            var Class =
            {
                elemNaviProto:$(defaultNavigationTemplate),
            }

            Class.genHTML = function ()
            {
                Base.prototype.genHTML.call(this);
                
                this._setupNavigationBar();
            }

            Class.onLeft = function()
            {
                bin.app.back();
            }
            
            Class.onRight = function()
            {
                
            }
            
            Class.setLeftImage = function(img)
            {
                var elem = this._naviLeft;
                if(!elem)
                {
                    return ;
                }
                elem.removeClass("bin-page-navi-text");
                elem.addClass('bin-page-navi-image');

                if(img && !img.startsWith("url("))
                {
                    img = "url('"+img+"')";
                }

                elem.text("");
                elem.css("background-image", img);
            }

            Class.setLeftText = function(text)
            {
                var elem = this._naviLeft;
                if(!elem)
                {
                    return ;
                }
                
                elem.removeClass("bin-page-navi-image");
                elem.addClass("bin-page-navi-text");

                elem.text(text);
            }

            Class.setRightImage = function(img)
            {
                var elem = this._naviRight;
                if(!elem)
                {
                    return ;
                }
                
                elem.removeClass("bin-page-navi-text");
                elem.addClass("bin-page-navi-image");

                if(img && !img.startsWith("url("))
                {
                    img = "url('"+img+"')";
                }

                elem.text("");
                elem.css("background-image", img);
            }
            
            Class.setRightText = function(text)
            {
                var elem = this._naviRight;
                if(!elem)
                {
                    return ;
                }
                
                elem.removeClass("bin-page-navi-image");
                elem.addClass("bin-page-navi-text");

                elem.text(text);
            }
            
            Class.setLeftVisible = function (show)
            {
                if(this._naviLeft)
                {
                    this._naviLeft.css("display", show ? "block" : "none");
                }
            }

            Class.setRightVisible = function (show)
            {
                if(this._naviRight)
                {
                    this._naviRight.css("display", show ? "block" : "none");
                }
            }

            Class.setTitle = function (title)
            {
                if(this._naviTitle)
                {
                    this._naviTitle.text(title);
                }
            }

            Class.setTitleVisible = function (show)
            {
                if(this._naviTitle)
                {
                    this._naviTitle.css("display", show ? "block" : "none");
                }
            }

            Class._naviAttr = function(elem, name)
            {
                var str   = elem.attr(name);
                if(!str)
                {
                    return null;
                }

                var ret = {};
                var pairs = str.split(';');
                var pair = null;
                for(var i=0,i_sz=pairs.length; i<i_sz; ++i)
                {
                    pair = pairs[i].split(':');
                    if(pair.length === 2)
                    {
                        ret[pair[0]] = pair[1];
                    }
                }

                return ret;
            }

            Class.$content = function()
            {
                return this.$(".bin-page-content");
            }

            Class._setupNavigationBar = function()
            {
                var self = this;
                // setup navagation
                var navContainer = this.$fragment(".bin-page-navi-bar");
                if(!navContainer)
                {
                    return ;
                }

                var elemNavBar = navContainer.holder();
                if(!elemNavBar.attr("naviCustom"))
                {
                    if(this.navTemplate)
                    {
                        navContainer.append(this.navTemplate);
                    }
                    else
                    {
                        navContainer.append(Class.elemNaviProto.clone());
                    }
                    var leftConfig   = this._naviAttr(elemNavBar, "naviLeft");
                    var rightConfig  = this._naviAttr(elemNavBar, "naviRight");
                    var titleConfig  = this._naviAttr(elemNavBar, "naviTitle");

                    this._naviLeft  = navContainer.find("#naviLeft");
                    this._naviRight = navContainer.find("#naviRight");
                    this._naviTitle = navContainer.find("#naviTitle");

                    if(titleConfig)
                    {
                        if(titleConfig.text)
                        {
                            this.setTitle(titleConfig.text);
                        }

                        if(titleConfig.hide === "true")
                        {
                            this.setTitleVisible(false);
                        }
                    }
                    
                    if(leftConfig)
                    {
                        if(leftConfig.image)
                        {
                            this.setLeftImage(leftConfig.image);
                        }
                        else if(leftConfig.text)
                        {
                            this.setLeftText(leftConfig.text);
                        }

                        if(leftConfig.hide === "true")
                        {
                            this.setLeftVisible(false);
                        }
                    }
                    else
                    {
                        this.setLeftImage(DEFAULT_NAVIBACK_IMAGE);
                    }

                    if(rightConfig)
                    {
                        if(rightConfig.image)
                        {
                            this.setRightImage(rightConfig.image);
                        }
                        else if(rightConfig.text)
                        {
                            this.setRightText(rightConfig.text);
                        }

                        if(rightConfig.hide === "true")
                        {
                            this.setRightVisible(false);
                        }
                    }
                    else
                    {
                        this.setRightVisible(false);
                    }

                    navContainer.setup();
                }
                else
                {
                    this._naviLeft  = elemNavBar.find("#naviLeft");
                    this._naviRight = elemNavBar.find("#naviRight");
                    this._naviTitle = elemNavBar.find("#naviTitle");
                }

                if(this._naviLeft)
                {
                    this._naviLeft.on("click", function(){self.onLeft()});
                }

                if(this._naviRight)
                {
                    this._naviRight.on("click", function(){self.onRight()});   
                }
            }
            
            return Base.extend(Class);
        }
);
