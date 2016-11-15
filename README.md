# BIN
BIN是一个简单、轻量的前端JS框架，可用于Hybrid(结合Cordova框架) APP、SPA(Single Page Application) APP、MPA(Multiple Page Application) APP以及一般的网页开发。<br/>

## [参考文档](https://github.com/BuildItNow/BIN_Documents) [开发示例](https://github.com/BuildItNow/BIN_Tutorials)

# 工程结构和开发模式
BIN工程结构<br/>
![工程结构](http://101.200.215.114:8080/res/img/gcjg.png)

从结构可以看出，采用BIN开发的项目能有良好的组织结构和模块划分能力，这对于工程管理是十分必要的。<br/>
BIN采用的开发模式十分贴近传统的GUI开发，无论多么复杂的一个UI，都可以通过搭积木的方式，将一个一个UI View组合而成。所以如果你曾经做过PC桌面程序、Android、IOS等传统GUI的开发，BIN你已经熟悉了一大半。<br/>
![概念类比](http://101.200.215.114:8080/res/img/vsnative.png)
BIN遵循MVC，OCP，KISS等原则，没有引入过多的模式和概念，保持简单但又足够强大！<br/>
<br/>

# 框架特性
## 前后端分离
BIN的开发是一种类CS结构，前后端开发人员各自关注自己的业务开发，通过约定的API进行数据交互，BIN提供了API本地数据Mock模块，前端能够更方便独立于服务器进行开发和自测。

## 代码本地化
BIN模块管理和加载机制采用RequireJS，针对RequireJS提供了基于Local Storage的本地化机制，对于业务代码，就可以考虑存放在本地，提升页面加载速度和用户体验<br/>
使用的缓存策略:<br/>
* 强缓存:第三方库代码、BIN框架代码，经过合并混淆后，文件名加HASH；带ID的资源图片
* 协商缓存(304):配置文件、带名称的资源图片
* 本地缓存(LocalStorage):业务代码<br/>
[Tutorials本地化](http://101.200.215.114:8080/apps/tutorials/index.html)     [Tutorials无本地化](http://101.200.215.114:8080/apps/tutorials-nolscache/index.html)<br/>
[Deamon本地化](http://101.200.215.114:8080/apps/deamon/index.html)     [Deamon无本地化](http://101.200.215.114:8080/apps/deamon-nolscache/index.html)

## 自动构建
BIN提供了基于Gulp的自动构建，在工程发布时，一键处理混淆、合并、压缩、内嵌以及引用处理。

## 页面内嵌(Inline)+Deferred Loading+Progressive Render
在MPA和WEB页面开发中，为了避免页面加载时的白屏，BIN引入了页面内嵌（Inline）机制，在自动构建阶段，将页面内容（比如home.html）自动内嵌到引导页面（比如index.html）,在访问index.html时，即渲染出home.html的内容。然后通过Deferred Loading和Progressive Render逐次显示各个子View中的内容。整个页面加载过程和传统的GUI加载过程类似（显示无网络依赖的内容－>填充有网络依赖的内容。

[Online Tutorials](http://101.200.215.114:8080/apps/tutorials/index.html)　[Online Deamon](http://101.200.215.114:8080/apps/deamon/index.html)
<iframe class="iphone-content" frameborder="0" name="i" width="330" height="520" src="http://101.200.215.114:8080/iphone-deamon.html">
</iframe>

## 功能
* 页面本地化（LocalStorage）
* 页面预加载
* 集成Baidu地图
* View抽象，H5页面栈
* 一般页面 Pageview
* 导航栏页面 NaviPageView
* 下拉刷新页面 RefreshView
* 列表页面 ListView
* 指示器 IndicatorView
* 日期时间选择器 DatePickerView
* Alert框 AlertView
* Tab栏 TabBarView
* Swipe页面 Swipeview
* Tab页面 TabView
* 图片延迟加载
* 网络API模块
* 网络缓存模块
* 数据中心模块，支持本地存储和会话存储
* 本地API测试框架，支持完全无依赖服务器进行开发
* rem自适应机制([demo](http://101.200.215.114:8080/apps/tutorials/index.html))<br/>

## 1px显示问题
1. 可以使用viewport scales设置为0.5达到整体效果，但是在Chrome上所有height:auto的元素文字可能会scale失败，解决方法是显式设置height为具体的尺寸<br/>
2. 在viewport scale设置为1情况下，使用transform:scale来达到效果

## [安装](https://github.com/BuildItNow/BIN/wiki/install)

## 目录结构
* bin : BIN 框架代码 <br/>
* config : 配置模板文件<br />
* index.html : BIN框架Web引导页面<br />

# 文档

# Core

## bin
bin是整个框架的命名空间，包含了可配置的Class结构(classConfig)，包含了全局的单件实例app,netManager,hudManager,debugManager,naviController,dataCenter。<br/>

## 配置文件
bin中的配置文件有globalConfig, requireConfig, classConfig, netLocalConfig。在bin/config中包含了这些配置文件的模板，实际应用中使用的是config目录下的。详细信息参见文件。<br/>
* globalConfig.js <br/>
对应用的整体配置，包含global和runtime两类配置数据。<br/>
global : 全局配置，通过bin.globalConfig获取，这里面是整个globalConfig里的内容 <br/>
runtime : 运行时配置，应用启动后，会根据global中runtime来选择对应的运行时配置，以方便我们不同版本的切换。<br/>
* requireConfig.js <br/>
对requirejs的整体配置
* classConfig.js <br/>
对bin类结构的配置，在这里面可以修改框架内部实际使用的类，已达到定制自己的类，比如Application，DataCenter... <br/>
注意 : 该结构定义中不存在没有依赖关系，仅仅是一个结构关系，所以在requirejs的define中不要直接使用，而是在运行时使用。
* netLocalConfig.js <br/>
网络API本地数据测试配置

## Application
Application是bin的应用基类，可通过classConfig中定制。
* init() <br/>
应用初始化，可添加自己的初始化操作。bin.Application会自动初始化debugManager,hudManager,netManager,naviController,dataCenter。
* run() <br/>
应用开始执行，可添加应用显示第一个页面的代码。
* onDeviceBack() <br/>
针对Android Device返回键点击回调，在PC上可通过悬浮Debug按钮模拟。
* onPause() <br/>
应用进程被Pause回调。
* onResume() <br/>
应用进程被Resume回调。

## bin.netManager
bin中的所有ajax http请求由netManager封装，netManager提供API抽象。netManager中提供四种策略(Policy)来定制网络处理的行为，bin提供了默认实现。<br/>
CachePolicy : 网络缓存策略,配置网络请求的数据在客户端如何缓存 <br/>
    + NORMAL : 一直缓存在本地,直到超过maxCacheDuration(Config中配置) <br/>
    + DURATION : 指定缓存的时间，过期后无效 <br/>
    + SESSION : APP期间一直有效，关闭后缓存失效 <br/>
    + USER_SESSION : 用户登陆期间有效，退出后失效 <br/>
CallbackPolicy : 网络回调策略，可在这里面添加在框架层面对请求的统一处理 <br/>
DebugPolicy : 网络本地数据测试策略 <br/>
SendCheckPolicy : 网络发送策略，处理网络请求在发送前的过滤逻辑 <br/>
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

## bin.hudManager
bin中所有hud显示由hudManager提供，比如Alert，Status，Indicator。 <br/>

* startIndicator(options) <br/>
开始菊花图。<br/>
options.model : 是否模态 true/false <br/>
返回本次菊花图ID，供stopIndicator使用 
* stopIndicator(indicatorID) <br/>
停止indicatorID指定的菊花图，如果没有指定，则完全取消菊花图。<br/>
注意 : bin对于菊花图支持计数机制。
* showStatus(message) <br/>
显示悬浮信息
* alert(options) <br/>
显示对话框

## bin.naviController
bin中提供了页面栈概念，由naviController完成。<br/>

* push(name, pushData, options) <br/>
跳转到name指定页面 <br/>
name : 页面名字
pushData : 向新页面传递的数据，新页面可通过onViewPush获取 <br/>
options : 跳转效果参数，可选

* pop(count, popData, options) <br/>
返回指定级数(count)页面 <br/>
count : 返回的级数 <br/>
popData : 向返回的页面传递的数据，返回页面可通过onViewBack获取 <br/>
options : 跳转效果参数，可选

* popTo(name, popData, options) <br/>
返回到指定页面 <br/>
参数参照pop操作

* current() <br/>
获取当前页面的栈数据，返回为{name, view} <br/>
name : 页面名字  <br/>
view : 页面对象

* getView(name) <br/>
获取指定页面的栈数据，返回结构同current() 

* startWith(name) <br/>
以name指定的新页面作为根页面，原来的页面栈将被清空 <br/>

## bin.dataCenter
提供数据中心封装，包含了本地持久化和本地会话，用户持久化和用户会话这几种数据库抽象。提供用户数据分离功能。

## bin.debugManager
在框架上提供调试功能，可参见应用中悬浮调试按钮，可在应用中直接查看console.log, console.info, console.error信息，方便调试。


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

# 开发和其他

# LICENSE
MIT
