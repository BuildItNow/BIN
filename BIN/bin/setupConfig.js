
define(["3rdParty/underscore/underscore", "config/globalConfig", "config/requireConfig"],
function(underscore, globalConfig, requireConfig)
{
	// setup require js config
	require.config(requireConfig);

	// setup application config
	var appConfig = 
	{
		name : "BIN WebAPP Framework"
	};

	_.extend(appConfig, globalConfig);

	bin.globalConfig  = appConfig;
	bin.runtimeConfig = appConfig[appConfig.runtime ? appConfig.runtime : "RELEASE"];

	return bin;
});