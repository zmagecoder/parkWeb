/**
 * 分页业务类
 * @param scope
 */
(function(scope) {
	var GridPager = PageTpl.extend({
		constructor : function() {
			this.base({'page_size':10});
		},
		record_event:function(data,currJq){
			currJq.setValues(data.data);
			if(data.data.EVENT_DATE != null && data.data.EVENT_DATE != "") {
				
				currJq.find('b').html(data.data.EVENT_DATE); 
				currJq.find('b').after(data.data.EVENT_CONTENT);
			}
			
		},
		query:function(queryInfo){
			scope.qryPager = null;
			this.contextPath = queryInfo.path;
			var attribute = {"clone_scope":"apiPagerTpl","clone_elt":"apiPagerEle","page_nav":"pageNavNew",'clone_elt_type':'p'};
			this.set_attr(attribute);
			jQuery.extend(this.param,{'ajaxUrl': queryInfo.url});
			jQuery.extend(this.param,queryInfo);
			this.query_info();
		}
	});
	scope.gridPager = new GridPager();
}(window));
$(function(){
	gridPager.query({'url':contextPath + '/getCompanyEvents'});
});
