 
define(["bin/config/globalConfig", "bin/config/requireConfig"],
function(globalConfig, requireConfig)
{
	// setup require js config
	require.config(requireConfig);

	bin.globalConfig  = globalConfig;
	bin.runtimeConfig = globalConfig[globalConfig.runtime ? globalConfig.runtime : "RELEASE"];

	return bin;
});