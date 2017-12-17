BIN is a lightweight frontend framework, follow the KISS principle. Easy but Powerful. It can be used to develop moble app, web app and even desktop app.
<br/>
## Features
* Only required **HTML,CSS,JavaScript** skills
* **Object oriented** and **Triditional GUI application oriented** development pattern
* **MVVM** feature(based on **[Vue 1.0](https://v1.vuejs.org/api/)**)
* Basic **components** for mobile and pc
* Build-in **router** feature, **view stack** management for mobile spa
* Client side **http api mock**
* **App shell** feature
* Basic **data persistence** feature

## Hello World

### [SPA](http://101.200.215.114/apps/spa-hello/index.html)
A simple **mobile SPA** build with BIN. It's a template project, use `bitnow init <project-name> spa` to generate your project from this template project.<br/>
[source code](https://github.com/BuildItNow/BIN-SPA-HELLO/tree/master/client)

### [MPA](http://101.200.215.114/apps/mpa-hello/index.html)
A simple **mobile MPA** build with BIN. It's a template project, use `bitnow init <project-name> mpa` to generate your project from this template project.<br/>
[source code](https://github.com/BuildItNow/BIN-MPA-HELLO/tree/master/client)

### [PC-SPA](http://101.200.215.114/apps/pcspa-hello/index.html)
A simple **PC SPA** build with BIN. It's a template project, use `bitnow init <project-name> pcspa` to generate your project from this template project.<br/>
[source code](https://github.com/BuildItNow/BIN-PCSPA-HELLO/tree/master/client)

## How to use
you can use the bitnow-cli to generate project from available template.

### Install bitnow-cli
``` bash
$ npm install -g bitnow-cli
```
### Generate project from template
``` bash
$ bitnow init <project-name> [template-name]
```

### Run the project
BIN is base on AMD to manage modules, so there is no need to compile and build for development. But on the other side, BIN does't use npm to handle dependencies.
cd to project dir and then:
``` bash
$ npm start
```

### Build the project
Build project for production. Bundle the framework, add version informations ...
``` bash
$ npm run build
```
or
``` bash
$ npm run build-start
```

### List available template
``` bash
$ bitnow list
```

### Update to the latest framework
The whole source code of framework comes to bin directory.
``` bash
$ bitnow update
```

### [Document](http://101.200.215.114/apps/bin/document.html)

## Auto generate code
bitnow-cli provides some useful view templates to generate the base view code.

### Create view code
``` bash
$ bitnow view create <view-path> [template-name]
```
the `view-path` is based on you current path, so `index` will create *index.html* and *index.js* in current path, and `login/index` will create *index.html* and *index.js* in *./login*, the parent path will be created by cli if not exists.
<br/>
In BIN, each view consists of **two files**: **.html** describes the structure and appearance, **.js** describes the logic of business and the **ViewModel** links them together. So it's more close to traditional web development and even close to traditional GUI application development.

### List available view template
``` bash
$ bitnow view list
```

## Description
* *bin* : framework code <br/>
* *config* : config files<br/>
* *index-spa.html* : boot index file for SPA<br/>
* *index-web.html* : boot index file for web<br/>

## LICENSE
MIT
