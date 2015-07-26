 
define(["config/globalConfig", "config/requireConfig", "config/classConfig"],
function(globalConfig, requireConfig, classConfig)
{
	// setup require js config
	require.config(requireConfig);

	bin.globalConfig  = globalConfig;
	bin.runtimeConfig = globalConfig[globalConfig.runtime ? globalConfig.runtime : "RELEASE"];
	bin.classConfig   = classConfig;
	
	return bin;
});