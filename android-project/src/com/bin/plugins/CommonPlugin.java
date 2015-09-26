package com.bin.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import com.bin.demo.bin;

public class CommonPlugin extends CordovaPlugin 
{
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException 
	{
		if(action.equals("openSystemBrowser"))
		{
			return openSystemBrowser(args, callbackContext);
		}
		
		return super.execute(action, args, callbackContext);
	}
	
	private boolean openSystemBrowser(JSONArray args, CallbackContext callbackContext)
	{
		try 
		{
			String url = args.getString(0);
		
			((bin)this.cordova.getActivity()).openSystemBrowser(url);
		} 
		catch (JSONException e) 
		{
			return false;
		}
		
		return true;
	}
}
