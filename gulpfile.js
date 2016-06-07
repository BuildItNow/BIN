var config  = require('./gulpconfig');
var gulp 	= require('gulp');
var fs      = require('fs');
var path    = require('path');
var glob    = require('glob');
var filter  = require('gulp-filter');
var jshint  = require('gulp-jshint');
var uglify  = require('gulp-uglify');
var cssMinify = require('gulp-clean-css');
var htmlMinify = require('gulp-htmlmin');
var md5     = require("md5");
var through = require('through2');
var cp 		= require('child_process');
var exec    = function(cmd, cb)
{
	var r = cp.exec(cmd, function (error, stdout, stderr) 
	{
		cb(error, stdout, stderr);
	});
	
	r.stdout.pipe(process.stdout);
	r.stderr.pipe(process.stderr);
}

var spawn   = cp.spawn;

var tempPath = config.temp || "dest-temp";
var destPath = config.dest || "dest";

var IGNORES = ["!bin/**", "!node_modules/**", "!./.*", "!"+destPath+"/**", "!"+tempPath+"/**"];

var getFilePath = function(patthern)
{
	var paths = glob.sync(patthern);
	if(!paths || paths.length === 0)
	{
		return null;
	}

	return paths[0];
}

var rmdirSync = function(rmPath) 
{
    var files = null;
    if(fs.existsSync(rmPath)) 
    {
        files = fs.readdirSync(rmPath);
        files.forEach(function(file,index)
        {

            var curPath = path.join(rmPath, file);
            if(fs.statSync(curPath).isDirectory()) 
            {
             	rmdirSync(curPath);
            } 
            else 
            { 
            	fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(rmPath);
    }
}

gulp.task('default', function() 
{
	
	
});

gulp.task('build-dest', ['build-fixref-bin', 'build-lscaches'], function(cb)
{
	rmdirSync(destPath);
	return 	gulp.src(path.join(tempPath, "**"))
			.pipe(gulp.dest(destPath));
});

gulp.task('build-fixref-bin', ['build-minify-bin'], function(cb)
{
	var indexPath = path.join(tempPath, "index.html");
	var requireMainPath = path.join(tempPath, "bin/requireMain.js");
	var binPath = path.join(tempPath, "bin/bin.js");
	var partyPath = path.join(tempPath, "bin/3party.js");
	var binMD5 = md5(fs.readFileSync(binPath, 'utf-8'));
	var partyMD5 = md5(fs.readFileSync(partyPath, 'utf-8'));

	var content = fs.readFileSync(requireMainPath, 'utf-8');
	content = content.replace("bin.js", "bin-"+binMD5+".js");
	content = content.replace("3party.js", "3party-"+partyMD5+".js");
	fs.writeFileSync(requireMainPath, content, 'utf-8');

	var name2md5 = {};
	var paths = 
	[
		getFilePath(path.join(tempPath, "**/require.js")), 
		getFilePath(path.join(tempPath, "**/bin.css")),
		requireMainPath,
		binPath,
		partyPath
	];

	var noExtName = null;
	var extName   = null;
	var dirName   = null;
	var fileMD5   = null;
	for(var i=0,i_sz=paths.length; i<i_sz; ++i)
	{
		extName   = path.extname(paths[i]);
		noExtName = path.basename(paths[i], extName);
		dirName   = path.dirname(paths[i]);

		name2md5[path.basename(paths[i])] = fileMD5 = md5(fs.readFileSync(paths[i], 'utf-8'));
		fs.renameSync(paths[i], path.join(dirName, noExtName+"-"+fileMD5+extName));
	}
	
	content = fs.readFileSync(indexPath, 'utf-8');
	content = content.replace("bin.css", "bin-"+name2md5["bin.css"]+".css");
	content = content.replace("require.js", "require-"+name2md5["require.js"]+".js");
	content = content.replace("requireMain.js", "requireMain-"+name2md5["requireMain.js"]+".js");
	if(config.useWindowLoading)
	{
		content = content.replace("__windowLoading", "true");
	}

	fs.writeFileSync(indexPath, content, 'utf-8');

	cb();
});

gulp.task('build-minify-bin', ["build-package-bin"], function(cb) 
{
	var filePaths = ["bin/**", "index.html", "local-caches.json"];

	var htmlFilter = filter("**/*.html", {restore: true});
	var cssFilter = filter("**/*.css", {restore: true});
	var jsFilter = filter(["**/*.js", "!bin/bin.js", "!bin/3party.js"], {restore: true});

	return gulp.src(["{"+filePaths.join(",")+"}"])
			.pipe(htmlFilter)
			.pipe(htmlMinify({collapseWhitespace: true, minifyCSS:true, minifyJS:true}))
			.pipe(htmlFilter.restore)
			.pipe(cssFilter)
			.pipe(cssMinify({compatibility: 'ie8'}))
			.pipe(cssFilter.restore)
			.pipe(jsFilter)
			.pipe(uglify())
			.pipe(jsFilter.restore)
			.pipe(gulp.dest(tempPath))
			.pipe(through.obj({}, 
			function(chunk, enc, callback)
			{
				callback(null, chunk);
			}, 
			function(cb)
			{
				fs.unlinkSync("bin/bin.js");
				fs.unlinkSync("bin/3party.js");
				cb();
			}));
});

gulp.task('build-package-bin', function(cb) 
{
	var n = 0;
	var f = false;
	var windows = process.platform === "win32";
	var onPackaged = function()
	{
		++n;
		if(n !== 2)
		{
			return ;
		}
		if(f)
		{
			cb("build-package fail");

			return ;
		}

		cb();
	}
	
	
	exec(windows ?'r.js.cmd -o 3party-build.js' :'r.js -o 3party-build.js', function(error, stdout, stderr) 
	{
		if(error)
		{
			f = true;
			console.log("3party-build fail");
		}
		else
		{
			console.log("3party-build success");
		}

		onPackaged();
	});

	exec(windows ? 'r.js.cmd -o bin-build.js' : 'r.js -o bin-build.js', function(error, stdout, stderr) 
	{
		if(error)
		{
			f = true;
			console.log("bin-build fail");
		}
		else
		{
			console.log("bin-build success");
		}

		onPackaged();
	});
});

var toLeftSlash = function(path)
{
	return path.replace(/\\/g, "/");
}

gulp.task('build-lscaches', ['build-minify'], function(cb) 
{
	var versionConfig = config.lsCaches;

	var basePath        = path.resolve(tempPath);
    var nodeRequire     = require;
    var localCachesPath = path.resolve("local-caches.json"); 
    var oldLocalCaches  = null;
    try
    {
        oldLocalCaches = nodeRequire(localCachesPath);
    }
    catch(e)
    {
        oldLocalCaches = {version:0, files:{}};
    }
    var newLocalCaches  = {};

    
    
    var pathToUrl = function(path)
    {
        var ret = path.replace(basePath, (basePath[basePath.length-1]==="/" || basePath[basePath.length-1]==="\\" ? "./" : '.'));
    	return toLeftSlash(ret);
    }

    var processDir = function(dirPath)
    {
        var files = fs.readdirSync(dirPath);
        var filePath = null;
        var fileStat = null;
        for(var i=0,i_sz=files.length; i<i_sz; ++i)
        {
            filePath = files[i];
            if(files[0] === '.')
            {
                continue;
            }
            filePath = path.join(dirPath, filePath);
            fileStat = fs.statSync(filePath);
            if(fileStat.isFile())
            {
                processFile(filePath)
            }
            else if(fileStat.isDirectory())
            {
                processDir(filePath)
            }
        }
    }

    var processFile = function(filePath)
    {
        var ext = path.extname(filePath);
        ext = ext.toLowerCase();
        if(!(ext === ".css" || ext === ".html" || ext === ".js"))
        {
            return ;
        }
        console.log("处理文件 "+filePath);
        
        var content = fs.readFileSync(filePath, "utf-8");
        var url     = pathToUrl(filePath);
        newLocalCaches.files[url] = md5(content);
    }

    var onLoad = function()
    {
		if (versionConfig.all) {
			newLocalCaches.all = true;
			newLocalCaches.version = oldLocalCaches.version + 1;
		} else {
			var newFiles = newLocalCaches.files;
			var oldFiles = oldLocalCaches.files;
			newLocalCaches.version = oldLocalCaches.version;
			for (var key in newFiles) {
				if (!oldFiles[key] || oldFiles[key] !== newFiles[key]) {
					newLocalCaches.version = oldLocalCaches.version + 1;
					break;
				}
			}

			for (var key in oldFiles) {
				if (!newFiles[key]) {
					newLocalCaches.version = oldLocalCaches.version + 1;
					break;
				}
			}
		}

		var content = JSON.stringify(newLocalCaches);
		fs.writeFileSync(localCachesPath, content, 'utf8');

		cb();
    }

    newLocalCaches.files = {};
    if(versionConfig.all)
	{
		onLoad();

		return;
	}

	var dirs = versionConfig.dirs;
	var dir = null;
	var dirStat = null;
	for (var i = 0, i_sz = dirs.length; i < i_sz; ++i) 
	{
		dir = dirs[i];
		dir = path.resolve(path.join(tempPath, dirs[i]));
		dirStat = fs.statSync(dir);
		if (dirStat.isFile()) 
		{
			processFile(dir)
		}
		else if (dirStat.isDirectory()) 
		{
			processDir(dir)
		}
	}

	onLoad();
});

gulp.task('build-minify',  function(cb)
{	
	rmdirSync(tempPath);

	var htmlFilter = filter("**/*.html", {restore: true});
	var cssFilter = filter("**/*.css", {restore: true});
	var jsFilter = filter("**/*.js", {restore: true});

	// html 
	return gulp.src(["./**", "!./*.*"].concat(IGNORES))
	.pipe(htmlFilter)
	.pipe(htmlMinify({collapseWhitespace: true, minifyCSS:true, minifyJS:true}))
	.pipe(htmlFilter.restore)
	.pipe(cssFilter)
	.pipe(cssMinify({compatibility: 'ie8'}))
	.pipe(cssFilter.restore)
	.pipe(jsFilter)
	.pipe(uglify())
	.pipe(jsFilter.restore)
	.pipe(gulp.dest(tempPath));
});

gulp.task('build-jshint', function(cb)
{	
	return gulp.src(["**/*.js", "!./*.js"].concat(IGNORES))
	.pipe(jshint())
	.pipe(jshint.reporter());
});

gulp.task('build', ["build-dest"], function(cb)
{
	rmdirSync(tempPath);
});

gulp.task('build-clean', function(cb)
{	
	rmdirSync(tempPath);
	rmdirSync(destPath);

	cb();
});

//////////////////////////////////////
//For web

gulp.task('web-build', ["web-build-dest"], function(cb)
{
	rmdirSync(tempPath);
});

var webpackages = 
	[	
		"3party-web-core-build.js", 
		"3party-web-mobile-build.js", 
		"3party-web-iscroll-build.js",
		"3party-web-hammer-build.js",
		"3party-web-swiper-build.js",
		"3party-web-md5-build.js",

		"bin-web-core-build.js",
		"bin-web-mobile-build.js",
		"bin-web-listView-build.js",
		"bin-web-scrollView-build.js",
		"bin-web-refreshView-build.js",
		"bin-web-swipeView-build.js",
		"bin-web-tabView-build.js",
		"bin-web-map-build.js",
	];

gulp.task('web-build-package-bin', function(cb) 
{
	var cmd = process.platform === "win32" ? "r.js.cmd -o " : "r.js -o ";
	var packages = [].concat(webpackages);

	var doPackage = function(name)
	{
		if(!name)
		{
			cb();
			return ;
		}

		exec(cmd+name, function(error, stdout, stderr) 
		{
			if(error)
			{
				console.log("package "+name +" fail");
			}
			else
			{
				console.log("package "+name +" success");
			}

			doPackage(packages.shift());
		});
	}

	doPackage(packages.shift());
});

gulp.task('web-build-minify-bin', ["web-build-package-bin"], function(cb) 
{
	var packages = [].concat(webpackages);
	var ignores = [];
	var unlinks = [];
	for(var i=0, i_sz=packages.length; i<i_sz; ++i)
	{
		packages[i] = packages[i].replace("-build", "");
		ignores.push("!bin/"+packages[i]);
		unlinks.push("bin/"+packages[i]);
	}

	var filePaths = ["bin/**", "local-caches.json"];

	var htmlFilter = filter("**/*.html", {restore: true});
	var cssFilter = filter("**/*.css", {restore: true});
	var jsFilter = filter(["**/*.js"].concat(ignores), {restore: true});

	return gulp.src(["{"+filePaths.join(",")+"}"])
			.pipe(htmlFilter)
			.pipe(htmlMinify({collapseWhitespace: true, minifyCSS:true, minifyJS:true}))
			.pipe(htmlFilter.restore)
			.pipe(cssFilter)
			.pipe(cssMinify({compatibility: 'ie8'}))
			.pipe(cssFilter.restore)
			.pipe(jsFilter)
			.pipe(uglify())
			.pipe(jsFilter.restore)
			.pipe(gulp.dest(tempPath))
			.pipe(through.obj({}, 
			function(chunk, enc, callback)
			{
				callback(null, chunk);
			}, 
			function(cb)
			{
				for(var i=0, i_sz=unlinks.length; i<i_sz; ++i)
				{
					fs.unlinkSync(unlinks[i]);
				}

				cb();
			}));
});

gulp.task('web-build-indexes-minify',  function(cb)
{	
	var htmlFilter = filter("**/*.html", {restore: true});
	var cssFilter = filter("**/*.css", {restore: true});
	var jsFilter = filter("**/*.js", {restore: true});

	// html 
	return gulp.src(config.webIndexes.files.concat(IGNORES))
	.pipe(htmlFilter)
	.pipe(htmlMinify({collapseWhitespace: true, minifyCSS:true, minifyJS:true}))
	.pipe(htmlFilter.restore)
	.pipe(cssFilter)
	.pipe(cssMinify({compatibility: 'ie8'}))
	.pipe(cssFilter.restore)
	.pipe(jsFilter)
	.pipe(uglify())
	.pipe(jsFilter.restore)
	.pipe(gulp.dest(tempPath));
});

gulp.task('web-build-fixref-bin', ['web-build-minify-bin', 'web-build-indexes-minify', 'build-minify'], function(cb)
{
	var packages = [].concat(webpackages);
	var packagePaths = [];
	for(var i=0, i_sz=packages.length; i<i_sz; ++i)
	{
		packages[i] = packages[i].replace("-build", "");
		packagePaths.push(path.join(tempPath, "bin/"+packages[i]));
	}

	var indexPath = null;
	var requireMainPath = path.join(tempPath, "bin/web/requireMain.js");
	var name2md5 = {};
	var paths = 
	[
		getFilePath(path.join(tempPath, "**/require.js")), 
		getFilePath(path.join(tempPath, "**/bin.css")),
		requireMainPath,
	];
	paths = paths.concat(packagePaths);

	var noExtName = null;
	var extName   = null;
	var dirName   = null;
	var fileMD5   = null;
	for(var i=0,i_sz=paths.length; i<i_sz; ++i)
	{
		extName   = path.extname(paths[i]);
		noExtName = path.basename(paths[i], extName);
		dirName   = path.dirname(paths[i]);

		name2md5[path.basename(paths[i])] = fileMD5 = md5(fs.readFileSync(paths[i], 'utf-8'));
		fs.renameSync(paths[i], path.join(dirName, noExtName+"-"+fileMD5+extName));
	}

	var cssMD5FileName = null;
	if(config.webIndexes.css)
	{
		var cssPath = path.join(tempPath, config.webIndexes.css); 
		var cssContent = fs.readFileSync(cssPath, 'utf-8');
		var cssMD5  = md5(cssContent);

		noExtName = path.basename(cssPath, ".css");
		dirName   = path.dirname(cssPath);

		fs.writeFileSync(path.join(dirName, noExtName+"-"+cssMD5+".css"), cssContent);

		cssMD5FileName = config.webIndexes.css;
		cssMD5FileName = cssMD5FileName.replace(noExtName+".css", noExtName+"-"+cssMD5+".css");
	}

	var webIndexes = [].concat(config.webIndexes.files); 
	
	for(var i=0,i_sz=webIndexes.length; i<i_sz; ++i)
	{
		indexPath = path.join(tempPath, webIndexes[i]); 

		console.log(indexPath);

		content = fs.readFileSync(indexPath, 'utf-8');
		content = content.replace("bin.css", "bin-"+name2md5["bin.css"]+".css");
		content = content.replace("require.js", "require-"+name2md5["require.js"]+".js");
		content = content.replace("requireMain.js", "requireMain-"+name2md5["requireMain.js"]+".js");
		if(config.useWindowLoading)
		{
			content = content.replace("__windowLoading", "true");
		}

		for(var j=0, j_sz=packages.length; j<j_sz; ++j)
		{
			content = content.replace(packages[j], packages[j].replace(".js", "")+"-"+name2md5[packages[j]]+".js");
		}

		if(cssMD5FileName)
		{
			content = content.replace(config.webIndexes.css, cssMD5FileName);
		}

		fs.writeFileSync(indexPath, content, 'utf-8');
	}

	cb();
});

gulp.task('web-build-dest', ['web-build-fixref-bin', 'build-lscaches'], function(cb)
{
	rmdirSync(destPath);
	return 	gulp.src(path.join(tempPath, "**"))
			.pipe(gulp.dest(destPath));
});















