
define(['module', "bin/3rdParty/md5/md5"], function (module, md5)
{
    var basePath        = require.toUrl("./");
    var nodeRequire     = require.nodeRequire;
    var localCachesPath = require.toUrl("./local-caches.json"); 
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
    var versionConfig   = null;
    
    var fs   = nodeRequire('fs');
    var path = nodeRequire('path');

    var pathToUrl = function(path)
    {
        return path.replace(basePath, "./");
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
        newLocalCaches.files[url] = md5.hex_md5(content);
    }

    var plugin = 
    {
        load: function(name, req, onLoad, config)
        {
            versionConfig = config.versionConfig;
            newLocalCaches.files = {};
            if(versionConfig.all)
            {
                onLoad();

                return ;
            }

            var dirs = versionConfig.dirs;
            var dir  = null;
            var dirStat = null;
            for(var i=0,i_sz=dirs.length; i<i_sz; ++i)
            {
                dir = dirs[i];
                dir = require.toUrl(dir);
                dirStat = fs.statSync(dir);
                if(dirStat.isFile())
                {
                    processFile(dir)
                }
                else if(dirStat.isDirectory())
                {
                    processDir(dir)
                }
            }

            onLoad();
        },
        onLayerEnd : function(write, data) 
        {
            if(versionConfig.all)
            {
                newLocalCaches.all     = true;
                newLocalCaches.version = oldLocalCaches.version+1; 
            }
            else
            {
                var newFiles = newLocalCaches.files;
                var oldFiles = oldLocalCaches.files;
                newLocalCaches.version = oldLocalCaches.version;
                for(var key in newFiles)
                {
                    if(!oldFiles[key] || oldFiles[key] !== newFiles[key])
                    {
                        newLocalCaches.version = oldLocalCaches.version+1;
                        break;
                    }
                }

                for(var key in oldFiles)
                {
                    if(!newFiles[key])
                    {
                        newLocalCaches.version = oldLocalCaches.version+1;
                        break;
                    }
                }
            } 

            var content = JSON.stringify(newLocalCaches);
            fs.writeFileSync(localCachesPath, content, 'utf8');
        }
    };

    return plugin;
});
