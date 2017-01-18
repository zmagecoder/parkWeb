/**
 * 分页对象核心js
 */
var qryPager;
(function(scope) {
	var PageTpl = Base.extend({
		constructor : function(attribute) {
			attribute= attribute || {};
			this.set_attr(attribute);
			this.def_page_size = 10;
			this.param = {"page_size":attribute['page_size'] || this.def_page_size};
		},
		set_attr:function(attribute){
			attribute= attribute || {};
			this.tplLi = attribute.clone_elt|| "ele_tpl";
			
			this.tplUlId = attribute.clone_scope || "panel_tpl";
			this.page_nav =attribute.page_nav || 'pageNav';
			this.clone_elt_type=attribute.clone_elt_type || "li";
			this.qry_scope_id =attribute['qry_scope_id'] || '';
		},
		clone:function(cloneObj){ //克隆，兼容ie7问题
			if(jQuery.browser =="msie"&&jQuery.browser.version.indexOf("7")>-1){
				var newObj = $("<li></li>");
	            newObj.append(cloneObj.html()); 
	            newObj.attr("id", ''); 
	            newObj.attr("style", $(cloneObj).attr("style")); 
	            newObj.attr("class", $(cloneObj).attr("class"));
	            newObj.show();
	            return newObj;  
			}
			
			var clone=cloneObj.clone().show();
			clone.attr("id","");
			return clone;
		},
		getParam :function(){ //获取参数
			var p_param = BaseUtil.getInputDomain(this.qry_scope_id); 	//组装参数
			jQuery.extend(this.param,p_param);
			return this.param;
		},
		setParam : function(currJq,json_data) {
			jQuery.extend(this.param, json_data);
		},
		query_info : function() {
			
			var param = this.getParam(), me = this;
			
			if(!qryPager) //不存在则创建对象，否则直接查询
			{	
				var pager = new Pager(this.page_nav,this.param["service_name"],this.param["method_name"],false,param,function(reply){
					me.render_info(reply);
				},false,null);
				window.qryPager = pager;
			}else {
				window.qryPager.setParam(param);
				param.page_index = 1;
				window.qryPager.doService(param);
			}
			
		},
		render_info : function(reply) {
			var me = this;
			if(typeof(this.render_info_before) =="function")
				this.render_info_before();
			if (reply){
				
				var data_list = reply.result;
				this.gettplUl().children(this.clone_elt_type+":gt(0)").remove();
				for (var i = 0, liData; liData = data_list[i++];) {
					this.bind_event(liData,i);
				}
				this.after_data_handle(data_list);
			} else {
				this.gettplUl().children(this.clone_elt_type + ":gt(0)").remove();
				//this.gettplUl().children(this.clone_elt_type+":gt(0)").fadeIn("fast",function() {me.gettplUl().children("li:gt(0)").remove();})
			}
		},
		bind_event : function(jsonData,i) {
			var cloneLi = this.clone(this.gettplLi()), me = this;
			cloneLi.data("qry_data", jsonData || {});
			(function(cloneLi) {
				var qry_data = cloneLi.data("qry_data");
				me.gettplUl().append(cloneLi.attr("id", "").show());
				
				me.record_event(qry_data,cloneLi,i);
				
				//设置样式处理器
				if(i%2==0)
					cloneLi.addClass("double").attr("index",i);
				cloneLi.bind("click",function(){
					me.gettplUl().children(me.clone_elt_type+":gt(0)").removeClass("curr");
					me.gettplUl().children(me.clone_elt_type+":gt(0):even").addClass("double");
					$(this).removeClass("double").addClass("curr");
				});
				
			}(cloneLi));
		},
		record_event:function(qry_data,cloneLi){},////TODO 子类实现}
		after_data_handle:function(reply){},////TODO 子类实现}
		gettplUl:function(){
			return $("#"+this.tplUlId);
		},
		gettplLi:function(){
			return $("#"+this.tplLi);
		},
		resetValues:function(){//重置所有值
			$("[fieldType='db'][type!='radio']").val("");
		}
	});
	window.PageTpl =PageTpl;
}(window));