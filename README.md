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
        启动本地服务器：node server.js，加载资源需要。<br/>
        启动本地API服务器：node server-demo.js，网络API请求需要。<br/>
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

# 开发和其他
1. 使用自己熟悉的一个编辑器，比如: Sublime，Notepad++，vim ... <br/>
2. 使用Chrome做模拟器和调试器。 <br/>
3. 由于PC和手机WebKit的差异，需要在手机端进行测试。 <br/>
4. 在Android手机上，为了避开不同手机在WebKit上的兼容性，BIN使用了Crosswalk内核，优点是：Crosswalk性能更好，不存在兼容性问题；缺点是：编译的APK会大10几MB；Crosswalk有lite版本，但是lite版本不稳定。<br/>

# LICENSE
MIT
