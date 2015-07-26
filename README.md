# BIN
BIN是一个简单、轻量、易用、跨平台的Web APP框架，BIN提供了对于APP开发的主体框架，通用的UI开发组件，使Web APP开发像Native APP开发一样，但是只需要开发一套代码。
##功能
* View概念
* 一般页面 Pageview
* 导航栏页面 NaviPageView
* 下拉刷新页面 RefreshView
* 列表页面 ListView
* 指示器 IndicatorView
* Alert框 AlertView
* Tab栏 TabBarView
* Swipe页面 Swipeview
* Tab页面 TabView
* 网络API模块
* 网络缓存模块
* 数据中心模块

## 安装
1. 安装nodejs <br/>
2. 下载BIN压缩包,参照demo开始你的应用开发 <br/>

## 目录结构
* bin : BIN 框架代码 <br/>
* demo : 演示APP<br />
* android-project : Android原生工程，用于打包Android APP<br />
* ios-project : IOS原生工程，用于打包IOS APP<br />
* tools : 包含一些开发工具<br />
    + server : Web APP的模拟服务器，在本地开发时需要<br />

## demo
BIN提供了一个demo APP，包含了BIN框架包含的所有功能的演示和实际开发的示例代码，demo也可以作为实际APP开发的模板。<br/>
在PC上演示demo:</br>
1. 拷贝bin目录中内容到demo/bin目录。 <br/>
2. 启动nodejs服务器: <br/>
        + 启动本地服务器：node server.js，加载资源需要。<br/>
        + 启动本地API服务器：node server-demo.js，网络API请求需要。<br/>
3. 打开Chrome浏览器，注意：Chrome需要使用--disable-web-security进行跨域，否则ajax请求会失败。</br>
4. 使用localhost:8080进行访问。
5. 右键，点击 审查元素，使用移动模式演示demo。

在Android手机上演示demo: <br/>
1. 拷贝bin目录中内容到demo/bin目录。 <br/>
2. 拷贝demo目录内容到android-project/asserts/www目录下。 <br/>
3. 编译APK安装。<br/> 

在IPhone手机上演示demo: <br/>
1. 拷贝bin目录中内容到demo/bin目录。 <br/>
2. 拷贝demo目录内容到ios-project/www目录下。 <br/>
3. 编译IPK安装。<br/> 

# 文档

# Core

## bin
bin是整个框架的命名空间，包含了全局的单件实例app,netManager,hudManager,debugManager,naviController,dataCenter。

## Application
Application是bin的应用基类，提供了init和run接口供重写，需要在globalConfig.js配置应用所采用的Application类。
* init() <br/>
应用初始化，可添加自己的初始化操作。bin.Application会自动初始化debugManager,hudManager,netManager,naviController,dataCenter。

* run() <br/>
应用开始执行，可添加应用显示第一个页面的代码。

## netManager
bin中的所有ajax http请求由netManager封装，netManager提供API抽象。netManager中提供四种策略(Policy)来定制网络处理的行为，bin提供了默认实现。<br/>
netCachePolicy : 网络缓存策略,配置网络请求的数据在客户端如何缓存 <br/>
	+ NORMAL : 一直缓存在本地,直到超过maxCacheDuration(Config中配置) <br/>
    	+ DURATION : 指定缓存的时间，过期后无效 <br/>
    	+ SESSION : APP期间一直有效，关闭后缓存失效 <br/>
    	+ USER_SESSION : 用户登陆期间有效，退出后失效 <br/>
netCallbackPolicy : 网络回调策略，可在这里面添加在框架层面对请求的统一处理 <br/>
netDebugPolicy : 网络本地数据测试策略 <br/>
netSendCheckPolicy : 网络发送策略，处理网络请求在发送前的过滤逻辑 <br/>
	+ ABORT_ON_REQUESTING : 同一个api请求，当已经存在请求，再次发送将会abort前一次请求 <br/>
	+ REJECT_ON_REQUESTING : 同一个api请求，当已经存在请求，再次发送将会被reject，不能请求 <br/>

* doAPI(params) <br/>
进行一次api操作,params为ajax的参数,同时包含bin定义的参数 <br/>
params.options : bin api选项 <br/>
	+ loading : 网络加载选项 默认为MODEL, true/false加载效果, MODEL表示同时添加模态效果, 网络请求同时，用户将不能进行UI操作。 <br/>
	+ cache   : 网络缓存选项 默认无, NORMAL/DURATION/SESSION/USER_SESSION <br/>
	+ cacheDuration : 指定缓存的时间(ms), 当cache为DURATION时有效 <br/>
	+ sendCheck : 网络发送选项 默认无, ABORT_ON_REQUESTING/REJECT_ON_REQUESTING <br/>

* setDebugPolicy(policy) <br/>
设置网络本地测试策略
* setCallbackPolicy(policy) <br/>
设置网络回调策略
* setCachePolicy(policy) <br/>
设置网络缓存策略
* setSendCheckPolicy(policy) <br/>
设置网络发送策略
* ajax(params) <br/>
发送ajax请求

# UI
## View
View是BIN中最基本的UI Controller，包含了HTML中某一个Element对应的逻辑，在ios中类似View Controller。
* constructor(options) <br/>
构造函数 <br/>
options.html : 从html构造view,html应该包含一个根Element <br/>
options.elem : 从已有Element构造view,elem可以是DOM或者JQuery节点 <br/>
options.el   : 从已有Element构造view,elem可以是DOM或者JQuery节点，这种方式不会触发render和show的调用 <br/>
注意：BIN中的view只能通过这几种方式来构造，三种方式是互斥的
* genHTML() <br/>
为view动态构造HTML结构函数
* preGenHTML() <br/>
genHTML的前事件函数
* posGenHTML() <br/>
genHTML的后事件函数
* asyncPosGenHTML() <br/>
posGenHTML的异步版本，对于需要依赖layout过后的属性(比如width,height)，在该函数中处理
* show() <br/>
显示该view
* hide() <br/>
隐藏该view
* remove() <br/>
移除该view,移除后，view在html中对一个的节点也会被移除
* onShow() <br/>
view在显示时被调用
* onHide() <br/>
view在隐藏时被调用
* onRemove() <br/>
view在移除时被调用，一些清理的逻辑在这里处理
* isShow() <br/>
返回view当前是否显示中
* $(sel, fromSel) <br/>
在view中从fromSel节点查询sel节点，并返回该节点，sel和fromSel为JQuery selector。如果fromSel为空，则从当前view的根节点查询；如果sel为空，返回view的根节点
* $html(sel, html) <br/>
如果html不为空，对sel节点设置html；如果html为空，则返回sel节点的html；如果sel为空，则对根节点操作
* $text(sel, html) <br/>
参照$html，不同点在于调用节点的text
* $append(sel, elem) <br/>
将elem插入到sel节点的最后
* $fragment(sel, fromSel) <br/>
对$(sel, fromSel)创建一个Fragment，对Fragment操作完后需要调用setup将实际内容append到$(sel, fromSel)节点

## PageView
PageView代表一个主页面，可具有过场动画；PageView从View继承
* goBack() <br/>
返回上一层页面
* onViewBack(backFrom, backData) <br/>
页面返回时回调 <br/>
backFrom : 所返回页面的名字 <br/>
backData : 所返回页面传递给该页面的参数 <br/>
* onViewPush(pushFrom, pushData, queryParams) <br/>
页面跳转时回调 <br/>
pushFrom : 该页面所跳转页面的名字 <br/>
pushData : 所跳转页面传递给该页面的参数 <br/>
queryParams : 所跳转页面在url中传递的参数，建议不要使用该种方式传递，而是采用pushData来传递 <br/>
注意 : onViewPush在render之前被调用
* onInAnimationBeg() <br/>
页面进入过场动画开始时回调
* onInAnimationEnd() <br/>
页面进入过场动画结束时回调
* onDeviceBack() <br/>
针对Android手机返回键点击事件回调，如果要处理该事件，不再传递该事件，请返回true

## NaviPageView
NaviPageView代表一个具有导航栏的主页面；NaviPageView从Page继承
* onLeft() <br/>
导航栏左按钮点击回调
* onRight() <br/>
导航栏右按钮点击回调
* setLeftImage(img) <br/>
设置左按钮的图片
* setRightImage(img) <br/>
设置右按钮的图片
* setLeftText(text) <br/>
设置左按钮的文本
* setRightText(text) <br/>
设置右按钮的文本 <br/>
注意 : 导航按钮不支持同时设置图片和文字 
* setLeftVisible(v) <br/>
设置左按钮是否显示
* setRightVisible(v) <br/>
设置右按钮是否显示
* setTitle(text) <br/>
设置导航栏Title
* setTitleVisible(v) <br/>
设置导航栏是否显示


# 开发和其他
1. 使用自己熟悉的一个编辑器，比如: Sublime，Notepad++，vim ... <br/>
2. 使用Chrome做模拟器和调试器。 <br/>
3. 由于PC和手机WebKit的差异，需要在手机端进行测试。 <br/>
4. 在Android手机上，为了避开不同手机在WebKit上的兼容性，BIN使用了Crosswalk内核，优点是：Crosswalk性能更好，不存在兼容性问题；缺点是：编译的APK会大10几MB；Crosswalk有lite版本，但是lite版本不稳定。<br/>

# LICENSE
MIT
