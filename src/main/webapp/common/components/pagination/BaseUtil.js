var BaseUtil = { 
	getInputDomain : function(context) {
		var iv = {}, me = this;
		context = context || $("body");
		if (typeof(context) == "string")
			context = $("#" + context);
		$("input[type='checkbox'][fieldType='db']:checked", context).each(
				function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("name");
					// 真值
					var ivVal = $obj.val();
					me.setObjVal(iv, ivId, ivVal);
					// 显示值
					var ivValDesc = $obj.attr("cname");
					me.setObjVal(iv, ivId + "_desc", ivValDesc);
				});

		// text
		$("input[type='text'][fieldType='db']", context).each(function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("id");
					var ivVal = $obj.val();
					me.setObjVal(iv, ivId, ivVal);

				});
		//密码
		$("input[type='password'][fieldType='db']", context).each(function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("id");
					var ivVal = $obj.val();
					me.setObjVal(iv, ivId, ivVal);

				});

		// hidden
		$("input[type='hidden'][fieldType='db']", context).each(function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("id");
					var ivVal = $obj.val();
					me.setObjVal(iv, ivId, ivVal);
				});

		//select
		$("[fieldType='db']select option:selected", context).each(function() {
			var $obj = $(this);
			var ivId = $obj.parent().attr("dbField")
					|| $obj.parent().attr("id");
			// 真值
			var ivVal = $obj.val();
			me.setObjVal(iv, ivId, ivVal);
			// 显示值
			var ivValDesc = $obj.text();
			me.setObjVal(iv, ivId + "_desc", ivValDesc);

		});
		// textarea
		$("textarea[fieldType='db']", context).each(function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("id");
					// 真值
					var ivVal = $obj.val();
					me.setObjVal(iv, ivId, ivVal);
				});

		$("span[fieldType='db']", context).each(function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("id");
					// 真值
					var ivVal = $obj.text();

					me.setObjVal(iv, ivId, ivVal);

				});
		
		$("a[fieldType='db']", context).each(function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("name");
					// 真值
					var ivVal = $obj.attr("value");
					me.setObjVal(iv, ivId, ivVal);

				});
		// radio
		$("input[type='radio'][fieldType='db']:checked", context).each(
				function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("name");
					// 真值
					var ivVal = $obj.val();

					me.setObjVal(iv, ivId, ivVal);
					// 显示值
					var ivValDesc = $obj.next("span").text();
					me.setObjVal(iv, ivId + "_desc", ivValDesc);
				});
		
		return iv;
	},
	setObjVal : function(obj, id, val) {
		if (obj == "undefined" || null == obj || null == id || '' == id)
			return;
		obj[id] = val;
	}
};