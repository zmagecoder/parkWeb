/**
 * 分页对象核心js
 */
(function(scope) {
	var RecordTpl = Base.extend({
		constructor : function(attribute) {
			attribute= attribute || {};
			this.set_attr(attribute);
		},
		set_attr:function(attribute){
			attribute= attribute || {};
			this.tplUlId = attribute.clone_scope || "panel_tpl";
			this.tplLi = attribute.clone_elt|| "ele_tpl";
			this.clone_elt_type=attribute.clone_elt_type || "li";
		},
		redRecord : function(list,func) {
			var me = this;
			if(typeof(this.render_info_before) =="function")
				this.render_info_before();
			if (list)
			{
				this.gettplUl().children(this.clone_elt_type+":gt(0)").remove();
				for (var i = 0, liData; liData = list[i++];) {
					
					this.bind_event(liData,i,func);
				}
			} else 
			{
				this.gettplUl().children(this.clone_elt_type+":gt(0)").fadeIn("fast",function() {me.gettplUl().children("li:gt(0)").remove();})
			}
			this.after_data_handle(list);
		},
		bind_event : function(jsonData,index,func) {
			var cloneLi = this.gettplLi().clone(), me = this;
			
			cloneLi.data("qry_data", jsonData || {});
			(function(cloneLi) {
				var qry_data = cloneLi.data("qry_data");
				me.gettplUl().append(cloneLi.attr("id", "").show());
				if(typeof(func) =="function")
					func(qry_data,cloneLi,index);
				else
					me.record_event(qry_data,cloneLi,index);
			}(cloneLi));
		},
		record_event:function(qry_data,cloneLi){
			// 子类实现
		},
		after_data_handle:function(list){
			// 子类实现
		},
		gettplUl:function(){
			return $("#"+this.tplUlId);
		},
		gettplLi:function(){
			return $("#"+this.tplLi);
		},
		resetValues:function(){
			//重置所有值
			$("[fieldType='db'][type!='radio']").val("");
		}
	});
	window.RecordTpl =RecordTpl;
}(window));

