function callFn(self) {
	var currIndex = new Number($(self).attr('index'));
	var pageCount = new Number($("a[pagename^='page']").size());
	for(var i=currIndex+1; i<currIndex+3; i++) {
		if(i == currIndex+2 && $("#foot_ellipsis_beforelast").attr('href')) {
			$("#foot_ellipsis_beforelast").insertAfter($("a[pagename='page"+i+"']"));
		}
		$("a[pagename='page"+i+"']").removeAttr('style');
	}
	
	for(var i=currIndex-1;i>currIndex-3;i--) {  //显示前2个
		 $("a[pagename='page"+ i +"']").removeAttr('style');
	}
	
	for(var i=currIndex-3; i>1 ;i--) {  //隐藏2个以前的
		$("a[pagename='page"+ i +"']").attr('style',"display:none");
	}
	
	for(var i=currIndex+3; i<pageCount ;i++) {  //隐藏2个以后的
		 $("a[pagename='page"+ i +"']").attr('style',"display:none");
	}
	
	//在第一页后面加入省略(如果page2被隐藏，就添加省略)
	if($("a[pagename='page2']").attr('style') && !$("#foot_ellipsis_after1").attr('href'))
		$("<a href='javascript:void(0)' id='foot_ellipsis_after1'>...</a>").insertAfter($("a[pagename='page1']"));
	
	//如果page2显示出来，就移除省略
	if(!$("a[pagename='page2']").attr('style')) 
		$("#foot_ellipsis_after1").remove();
	
	//如果倒数第2个page被展示出来，就移除
	if(!$("a[pagename='page"+(pageCount-1)+"']").attr('style')) 
		$("#foot_ellipsis_beforelast").attr('style','display:none');
	
	if($("a[pagename='page"+(pageCount-1)+"']").attr('style')) 
		$("#foot_ellipsis_beforelast").removeAttr('style');
	
}