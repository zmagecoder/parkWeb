/**
 * jquery dom扩展操作
 */
$.fn.extend({
	setValue: function(name,value){
		if($(this).find("[name='"+name+"']").length>0){
			var obj = $(this).find("[name='"+name+"']");
			var tagName = obj.get(0).tagName;
			if(tagName=="INPUT"){
				obj.val(value);
			}else if(tagName=="IMG" && value){
				obj.attr({"src":value});
			}else{
				obj.html(value);
			}
		}
	},
	setValues:function(queryData){
		for(p in queryData)
		{
			$(this).setValue(p,queryData[p]);
		}
	}
});

/**
 * jq操作扩展
 * @param $
 */
(function($){
	/**
	 * 判断字符串是否为空
	 */
    $.isEmptyStr = function(str){
        if(null != str && '' != str && 'undefined' != str)
        	return false;
        return true;
    };
    
    /**
	 * 获取url中的参数
	 */
	$.getUrlParam = function(url, name) {
		var theRequest = {}; 
		if (url.indexOf("?") != -1) { 
			var str = url.substr(url.indexOf("?") + 1); 
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i ++) {
				var key = strs[i].substr(0, strs[i].indexOf('='));
				var val = strs[i].substr(strs[i].indexOf('=') + 1, strs[i].length);
				theRequest[key]= val; 
			} 
		}
		return theRequest[name];
    };
    
    
    /**
	 * 判断数组是否为空
	 */
    $.isEmptyArray = function(list){
    	if(list && list instanceof Array && list.length > 0)
    		return false;
    	return true;
    };
    
	//重写ajax请求
	var _ajax = $.ajax;
	$.mageAjax = function(opt){
		/*******************处理url参数开始**************************/
		var ajaxUrl = opt.url;
		var urlParams = $.getUrlParam(ajaxUrl);
		if(ajaxUrl.indexOf('?') > -1)
			ajaxUrl = ajaxUrl.substr(0, ajaxUrl.indexOf('?'));
		if(!$.isEmptyObject(urlParams)){				//加密url所有参数
			var pCount = 0;
			for(var p in urlParams){
				if(pCount == 0){
					ajaxUrl += "?" + p + "=" + strEnc(urlParams[p],'cntenKey');
				}else {
					ajaxUrl += "&" + p + "=" + strEnc(urlParams[p],'cntenKey');
				}
				pCount++;
			}
		}
		opt.url = ajaxUrl;
		/*******************处理url参数结束**************************/
		
		/*******************处理data参数开始**************************/
		var dataParams = opt.data;
		var orgParams = {};
		if(!$.isEmptyObject(dataParams)){
			for(var p in dataParams){
				orgParams[p] = dataParams[p];
				dataParams[p] = strEnc(dataParams[p] + '','cntenKey');
			}
		}
		opt.data = dataParams;
		/*******************处理data参数结束**************************/
		var fn = {
			error:function(XMLHttpRequest, textStatus, errorThrown){},
			success:function(data, textStatus){}
		}
		if(opt.error){
			fn.error=opt.error;
		}
		if(opt.success){
			fn.success=opt.success;
		}
		var _opt = $.extend(opt,fn);
		_ajax(_opt);
		_opt.url = ajaxUrl;
		if(!$.isEmptyObject(orgParams)){
			for(var p in orgParams){
				_opt.data[p] = orgParams[p];
			}
		}
	};
})(jQuery);