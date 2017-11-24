BIN is a lightweight frontend framework, follow the KISS principle. Easy but Powerful. It can be used to develop moble app, web app and even desktop app.
<br/>

## [Document](http://101.200.215.114/apps/bin/document.html) [Example](http://101.200.215.114/apps/tutorials/index.html)

## How to use
you can use the bitnow-cli to generate project from available template.

### Install bitnow-cli
``` bash
$ npm install -g bitnow-cli
```
### Generate project from template
``` bash
$ bitnow init <project-name> [template]
```

### Run the project
BIN is base on AMD to manage modules, so there is no need to compile and build for development. But on the other side, BIN does't use npm to handle dependencies.
``` bash
$ npm start
```

### Build the project
Build project for production. Bundle the framework, add version informations ...
``` bash
$ npm run build
```

### List available template
``` bash
$ bitnow list
```

### Update to the latest framework
The whole source code of framework comes to bin directory.
``` bash
$ bitnow list
```

## Auto generate code
bitnow-cli provides some useful view templates to generate the base view code.

### Create view code
``` bash
$ bitnow view create <view-path> [template-name]
```
the `view-path` is based on you current path, so `index` will create ** *index.html* ** and ** *index.js* ** in current path, and `login/index` will create ** *index.html* ** and ** *index.js* ** in ** *./login* **, the parent path will be created by cli if not exists.
In BIN, each view consists of **two files**: ** *.html* ** describes the structure and appearance, ** *.js* ** describes the logic of business and the **ViewModel** links them together. So it's more close to traditional web development and even close to traditional GUI application development.

### List available view template
``` bash
$ bitnow view list
```

## Description
* *bin* : framework code <br/>
* *config* : config files<br/>
* *index-spa.html* : boot index file for SPA<br/>
* *index-web.html* : boot index file for web<br/>

# LICENSE
MIT
