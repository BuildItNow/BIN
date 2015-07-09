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

在Android手机上演示demo: <br/>
1. 拷贝bin目录中内容到demo/bin目录。 <br/>
2. 拷贝demo目录内容到android-project/asserts/www目录下。 <br/>
3. 编译APK安装。<br/> 

在IPhone手机上演示demo: <br/>
1. 拷贝bin目录中内容到demo/bin目录。 <br/>
2. 拷贝demo目录内容到ios-project/www目录下。 <br/>
3. 编译IPK安装。<br/> 


