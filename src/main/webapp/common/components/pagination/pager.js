/**
 *分页控件
 *var pager = new Pager(div_id,action_id,is_sql,param,function(reply){});
 *@param div_id:页面放置table的div_id
 *@param action_id:java或者sql服务的action_id
 *@param is_sql:是否sql服务,true表示sql，false表示java服务
 *@param param:参数，可以设置初始每页展示数据大小：{page_size:15,key1:value1,key2:value2}
 *
 *@param call_back:用户回调函数，返回一个list对象
 *@param hide_pager：隐藏分页控件
 */
(function(scope) {
	var Pager = Base.extend({
		constructor : function(div_id,func_id,method_name,is_sql,param,call_back,exp_excel,queryTable,hide_pager,class_name,pager_modal,isSy) {
			this.version = "1.0";
			this.config={};
			this.config.param=param;
			this.config.div_id =div_id;
			this.config.table_id =div_id+"_table";
			this.config.func_id =func_id;
			this.config.is_sql =is_sql;
			this.config.method_name=method_name;
			this.config.call_back =call_back;
			this.config.page_size =param.page_size||10;
			this.config.page_index =1;
			this.config.exp_excel = exp_excel;
			this.queryTable =queryTable;
			this.config.hide_pager =hide_pager || false;
			this.config.class_name = class_name;
			this.isSy = isSy || false;
			apply(this.config,param);
			this.pager_modal =pager_modal;
			this.config.init = true;					//初始化标识
			this.doService();
			if(this.config.exp_excel){ //集成excel导出功能
				try{excelBase._init();}catch(e){}
			}
		},
		setParam:function(param){
			apply(this.config,param);
		},
		resetPageParam:function(param){
			var me = this;
			me.config.total_count=0;//总记录数
			me.config.page_count=0;//总页数
			me.config.page_index=1;//当前页索引
		},
		doService:function(){
			var me = this;
			$(me.config.param).each(function(){
				this.page_index = me.config.page_index;
			});
			if(this.isSy){
				jQuery.ajax({
			        type : "post",
			        url : me.config['ajaxUrl'],
			        dataType : "json",
			        data : me.config.param,
			        cache : false,
			        async : true,
			        timeout : 60000,
			        success:function(reply) {
			        	if(!reply || !reply.data){
							me.resetPageParam();
							me.renderPage();
							return;
						}
						
						if(!reply.data.hasOwnProperty('totalSize') ){
							me.config.call_back({"list":reply.data.result});
							return;
						}
						
						var list = reply.data.result;
						if(list.length==0){
							//alert('暂无数据');
							me.config.call_back(null);
							me.resetPageParam();
							me.renderPage();
							return;//防止报错
						}
						
						me.config.total_count=reply.data.totalSize;//总记录数
						me.config.page_count=reply.data.pageCount;//总页数
						me.config.page_index=reply.data.pageIndex;//当前页索引
						me.config.page_size=reply.data.pageSize;//每页的记录行数
						
						if(me.config.is_sql){//sql
							me.config.data_list = reply.data[me.config.func_id];//对象列表
						}else{//java
							me.config.data_list = reply.data;//对象列表
						}
						me.renderPage();
						me.config.call_back(me.config.data_list);
						me.renderTable();
			        },
			        error:function(err) {
			        	alert("分页插件：取得后台数据出错");
			        }
			    });
			}else{
				jQuery.ajax({
			        type : "post",
			        url : me.config['ajaxUrl'],
			        dataType : "json",
			        data : me.config.param,
			        cache : false,
			        async : true,
			        timeout : 60000,
			        success:function(reply) {
			        	if(!reply || !reply.data){
	                        //alert('暂无数据');
	                        me.config.call_back(null);
	                        me.renderPage();
	                        return;//防止报错
	                    }
	                    var list = reply.data.result;
	                    if(null==list || null == list ||  list.length==0){

	                        //alert('暂无数据');
	                        me.config.call_back(null);
	                        me.renderPage();
	                        return;//防止报错
	                    }
	                    
	                    me.config.total_count=reply.data.totalSize;//总记录数
						me.config.page_count=reply.data.pageCount;//总页数
						me.config.page_index=reply.data.pageIndex;//当前页索引
						me.config.page_size=reply.data.pageSize;//每页的记录行数
						
						if(me.config.is_sql){//sql
							me.config.data_list = reply.data[me.config.func_id];//对象列表
						}else{//java
							me.config.data_list = reply.data;//对象列表
						}
						me.renderPage();
						me.config.call_back(me.config.data_list);
						me.renderTable();
			        },
			        error:function(err) {
			            alert("分页插件：取得后台数据出错");
			        }
			    });
			}
		},
		renderPage:function(){
			if(this.config.init) this.getTableDiv().html(this.genPager());  //初始化加载一次
			
			this.initEvent();
			this.initPagerInfo();
		},
		genPager:function(){
			//隐藏分页套件
			var me = this;
			var style='display:block;';
			if(this.config.hide_pager)
				style='display:none;';
			var htmlArr = [];       
			//添加事件ID
			$(".page_first", $("div#"+me.config.div_id)).attr("id", me.config.table_id+"_buttonFirstPage");
			$(".page_last", $("div#"+me.config.div_id)).attr("id", me.config.table_id+"_buttonLastPage");
			$(".page_pre", $("div#"+me.config.div_id)).attr("id", me.config.table_id+"_buttonPrevPage");
			$(".page_next", $("div#"+me.config.div_id)).attr("id", me.config.table_id+"_buttonNextPage");
			//$("#dynamicNum")   span
			var pageCount = me.config.page_count;
			var ellipsis = new Number(me.config.page_count)>4?true:false;
			for(var i=1;i<=pageCount;i++){
				var item = $("#dynamicNum").children().first().clone().removeAttr('style');
				if(i==1) {
					item.attr({'pagename':'page'+i,'index':i,'class':'this'});
					item.html(i);
				}else if(i<=5 || i==pageCount){
					item.attr({'pagename':'page'+i,'index':i});
					item.html(i);
				}else if(i>5 && i<pageCount) {
					item.attr({'pagename':'page'+i,'index':i, 'style':'display:none'});
					item.html(i);
					if(ellipsis) {
						$("<a href='javascript:void(0)' id='foot_ellipsis_beforelast'>...</a>").appendTo($("#dynamicNum"));
						ellipsis = false;
					}
				}
				$(item).appendTo($("#dynamicNum"));
				
			}
			me.config.init = false;				//footer初始化完成
			
		},
		initEvent:function(){
			var me = this;
			$('#'+me.config.table_id+'_buttonFirstPage').bind("click",function(){   	   //首页
		  		if(new Number(me.config.page_index) !=1){
	          		me.config.page_index =1;
		          	me.doService();
	          	}
			});
			
			$('#'+me.config.table_id+'_buttonLastPage').bind("click",function(){			//最后一页
				var p_page_index =me.config.page_index+"";
				var p_page_count =me.config.page_count+"";
		  		if(p_page_index!=p_page_count){
	          		me.config.page_index =me.config.page_count;
		          	me.doService();
	          	}
			});
			
			$("[pagename^='page']").unbind().bind("click",function(){ 			 //go指定页
				$(this).siblings().removeClass('this').end().addClass("this");
					var _index = new Number($(this).attr('index'));
	          		me.config.page_index = _index;
		          	me.doService();
		          	$('body,html').animate({scrollTop:0},500);
		          	callFn(this);		//点击后调用回调

			});
			
			$('#'+me.config.table_id+'_buttonPrevPage').unbind().bind("click",function(){	  	  //上一页
				if(new Number(me.config.page_index) >1){
					//改变选中样式
					$("a[pageName='"+"page"+(new Number(me.config.page_index)-1)+"']").siblings().removeClass('this').end().addClass("this");
	          		me.config.page_index =new Number(me.config.page_index)-1;
		          	me.doService();
		          	$('body,html').animate({scrollTop:0},500);
		          	callFn($("a[pageName='"+"page"+(new Number(me.config.page_index)-1)+"']"));    //点击后调用回调
	          	}
			});
			$('#'+me.config.table_id+'_buttonNextPage').unbind().bind("click",function(){			 //下一页
		  		if(new Number(me.config.page_index) < new Number(me.config.page_count)){
		  			//改变选中样式
		  			$("a[pageName='"+"page"+(new Number(me.config.page_index)+1)+"']").siblings().removeClass('this').end().addClass("this");
	          		me.config.page_index =new Number(me.config.page_index)+1;
		          	me.doService();
		          	$('body,html').animate({scrollTop:0},500);  
		          	callFn($("a[pageName='"+"page"+(new Number(me.config.page_index)+1)+"']"));     //点击后调用回调
	          	}
			});
			
			
			$('#'+me.config.table_id+'_export_excel').bind("click",function(){ //导出excel对象
				queryTable && queryTable.exportExcel(me.config);
				return false;
			});
			
			$('#'+me.config.table_id+'_export_all_excel').bind("click",function(){ //导出excel对象
				me.config.all_page="yes";
				queryTable && queryTable.exportExcel(me.config);
				return false;
			});
			me.getPager().find("[name='paySub']").bind("click",function(){
				var ps = $("#"+me.config.table_id+"_pSize").val();
				var number = /^\d+$/;
				if(!number.test(ps)){
					alert("页面显示条数请输入数字！");
					return ;
				}
				ps = new Number(ps);
				if(ps<1){
					alert("请输入大于0的数字!") ;
					return ;
				}
				var pageSize=30;
				if(ps > pageSize){
					alert("系统不建议使用超过"+pageSize+"条记录的分页，请使用更小的数字！");
					return ;
				}
				var pi = $("#"+me.config.table_id+"_pIndex").val();
				if(!number.test(pi)){
					alert("请输入数字类型的页数!") ;
					return ;
				}
				pi = new Number(pi);
				if( pi <= 0 || pi> new Number(me.config.page_count) ){
					
					if(me.config.page_count ==0){
						alert("请输入大于0的数字!");
						return ;
					}
					
					alert("请输入大于0且小于或等于" + me.config.page_count + "的数字!");
					return ;
				}
				me.config.page_size = ps;
				me.config.page_index =pi ;
				me.doService();
			});
		},
		initPagerInfo:function(){
			var me = this;
			if(me.config.total_count =="undefined" || typeof(me.config.total_count) =="undefined" || !me.config.total_count)
				me.config.total_count=0;
			
			if(me.config.page_count =="undefined" || typeof(me.config.page_count) =="undefined" || !me.config.page_count)
				me.config.page_count=0;
			
//			var skip="<span>共<strong>"+me.config.total_count+"</strong>条</span>"
//					+"<span>每页<input type='text' class='ui_input' style='width:40px;' id='"+me.config.table_id+"_pSize' size='5' value='"+me.config.page_size+"'></span>"
//					+"<span><strong>"+me.config.page_index+"</strong>/"+me.config.page_count+"    "	
//					+"到<input type='text' class='ui_input'  style='width:40px;' id='"+ me.config.table_id + "_pIndex' size='5' value='"+me.config.page_index+"'>页</span>";
//			
			var skip="<span>共<strong>"+me.config.total_count+"</strong>条</span>"
			+"<span>每页<input type='text' class='ui_input' style='width:40px;' id='"+me.config.table_id+"_pSize' size='5' value='"+me.config.page_size+"'></span>"
			+"<span><strong>"+me.config.page_index+"</strong>/"+me.config.page_count+"    "	
			+"到<input type='text' class='ui_input'  style='width:40px;' id='"+ me.config.table_id + "_pIndex' size='5' value='"+me.config.page_index+"'>页</span>";
			
			if(this.pager_modal =="simple"){
				if(typeof me.config.page_count !='undefined'){
					if(me.config.page_count ==0)
					 	skip="<a href='javascript:void(0)' class='prev'><font color='red'>0</font>/"+(me.config.page_count )+"</a>";
					else
						 skip="<a href='javascript:void(0)' class='prev'><font color='red'>"+me.config.page_index+"</font>/"+(me.config.page_count )+"</a>";
				}else
				 skip="<a href='javascript:void(0)' class='prev'><font color='red'>0</font>/0</a>";
			}
			//alert(me.getPager().find(".skip").length)
			me.getPager().find(".skip").html(skip);
		},
		renderTable:function(){
			var me = this;
			var tableJq = this.getTablePanel();
			tableJq.find('tr').addClass("th2");
			tableJq.find('tr:even').removeClass("th2").addClass("th3");
			tableJq.find('tr').hover(function(){
					$(this).addClass("alt");
				},function(){
					$(this).removeClass("alt");
				});
			tableJq.find('tr').click(function(){
				$(this).addClass("clk").siblings().removeClass("clk");
				var curIndex = $(this).index();
				var curData = me.config.data_list[curIndex-1];//当前数据对象
				var exec_func = me.config.div_id+"_afterScroll";
				if(!exec_func)return;
				try{
					var fun = eval(exec_func);
					if(typeof(fun) != "function") return;
					fun.call(window,curData);//执行自定义函数
				}catch(e){}
			});
		},
		getTableDiv:function(){
			return $("#"+this.config.div_id);
		},
		getPager:function(){
			return this.getTablePanel().next("[name='pageList']");
		},
		getTablePanel:function(){
			return $("#"+this.config.table_id);
		},
		clear:function(){
			this.getTableDiv().html("");
		}
		
	});
	window.Pager =Pager;
}(window));

function apply(o, c, defaults) {
	if(defaults) {
		apply(o, c);
	}
	if(o && c && typeof c == 'object'){
		for (var p in c) { 							// 字符串的false转换为boolean
			if (c[p] == "false"){
				c[p] = false;
			}
			if (c[p] == "true"){
				c[p] = true;
			}
			o[p] = c[p];
		}
	}
	return o;
}