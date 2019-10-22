var Global = {};

/***********************函数性文件***********************/

(function($) {

	var tempCache = {};

	/**
	 * 异步获取模板并渲染模板
	 * @param  string   url      模板路径
	 * @param  object   opts     JSON数据源
	 * @param  function callback 获取模板后的回调函数
	 * @return null
	 */
	Global.requestTempByAjax = function(url, opts, callback) {
		var options = {};
		var template = '';

		if (typeof tempCache[url] !== 'undefined') {
			options['result'] = opts;
			template = ejs.render(tempCache[url], options);
			callback(template);
		} else {

			// 请求模板
			$.when($.ajax({
				method: 'GET',
				url: url, // '../../temp/awardList.ejs'
				dataType: 'html'
			})).then(function(res) {
				options['result'] = opts;
				template = ejs.render(res, options);
				callback(template);

				tempCache[url] = res;

			}, function(res) {

			});
		}


	}

	/**
	 *获取url上面的参数值
	 *@param string name 参数名
	 *return string 参数值
	 */
	Global.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if (r != null) return unescape(r[2]);
		return null; //返回参数值
	}



	/**
	 * 动态添加样式表文件
	 * @param string 		url      	样式表文件地址
	 * @param string 		position 	样式表文件插到页面位置
	 */
	Global.addLink = function(url, id, position) {

		if (!url) return;
		if (!id) return;

		var position = position || 'head';

		var link = $('<link id="' + id + '" href="' + url + '" rel="stylesheet" type="text/css">');

		$(position).append(link);
	}

	/**
	 * 动态添加js文件
	 * @param string 		url      	js文件地址
	 * @param string 		position 	js文件插到页面位置
	 */
	Global.addScript = function(url, id, position) {
		if (!url) return;
		if (!id) return;

		var position = position || 'body';

		var scripts = $('<script id="' + id + '" src="' + url + '" type="text/javascript"></script>');

		$(position).append(scripts);
	}

	/**
	 * 验证表单
	 * @param  string element 	需要验证的表单容器
	 * @param  string type      返回类型，只支持 ‘boolean’ 和 ‘object’
	 * @return object           验证后的返回值
	 */
	Global.initValidate = function(element, type) {
		var validate = null;
		var validField = null; // 需要验证的表单域的JQ对象
		var element = $(element);
		var validateDom =
			'div[data-validateInfor],select[data-validateInfor],textarea[data-validateInfor],input[data-validateInfor]';
		validate = new Validate();
		validField = element.find(validateDom);

		// 循环需要验证的字段
		for (var i = 0, len = validField.length; i < len; i++) {
			var valideArr = $(validField[i]).attr('data-validateInfor').split('|');
			var valideRes = [];

			if (valideArr.length > 0) {
				for (var j = 0, jLen = valideArr.length; j < jLen; j++) {

					var validateInfor = {};
					var validateRule = valideArr[j].replace(/{|}/g, '').split(',');

					validateInfor[validateRule[0].split(':')[0]] = validateRule[0].split(':')[1];
					validateInfor[validateRule[1].split(':')[0]] = validateRule[1].split(':')[1];

					// 把验证信息变成对象
					valideRes.push(validateInfor);
				}
			}

			//console.log(valideArr.toString());

			// 添加验证信息
			validate.add($(validField[i]), valideRes);
		}

		var msg = validate.start(type);

		// 如果错误信息以对象形式返回
		if (type === 'object') {
			if (typeof msg === 'object' && !Global.isObjectEmpty(msg)) {
				return msg;
			} else {
				return true;
			}
		} else if (typeof msg !== 'undefined') {
			common.alert({
				mask: true,
				content: msg
			});
			return false;
		}

		return true;
	};

	/**
	 * 获取指定容器的所有字段数据
	 * @param  string element 	需要获取字段的容器
	 * @param  string type    	返回值类型，目前只支持 json返回 和 serialize序列化后返回
	 * @return object       	返回的字段
	 */
	Global.getField = function(element, type) {
		var fieldData = {};
		var element = $(element);

		//  获取的表单域所有元素名
		var fieldTagName = 'input,textarea,select';

		// 获取表单域的type值
		var field = ['text', 'password', 'hidden', 'file', 'textarea', 'select'];
		var allField = element.find(fieldTagName);

		var checkboxs = [];
		if (element.find('input[type=checkbox]').length > 0) {
			checkboxs = element.find('input[type=checkbox]');
		}

		var radios = [];
		if (element.find('input[type=radio]').length > 0) {
			radios = element.find('input[type=radio]');
		}

		// 收集除了checkbox和radio之外的所有表单域
		for (var i = 0, l = allField.length; i < l; i++) {
			var $field = $(allField[i]);
			if (field.indexOf($field.attr('type')) !== -1 || field.indexOf(allField[i].tagName.toLowerCase()) !== -1) {
				fieldData[$field.attr('name')] = $field.val();
			}
		}

		// 收集radio表单域
		if (radios.length > 0) {
			for (var i = 0, len = radios.length; i < len; i++) {
				if (radios.eq(i).is(':checked')) {
					fieldData[radios.eq(i).attr('name')] = radios.eq(i).val();
				}
			}
		}

		// 收集checkbox表单域
		if (checkboxs.length > 0) {
			var checkboxCache = {};
			for (var i = 0, len = checkboxs.length; i < len; i++) {
				if (!(checkboxs.eq(i).attr('name') in checkboxCache)) {
					checkboxCache[checkboxs.eq(i).attr('name')] = [];
				}

				if (checkboxs.eq(i).is(':checked')) {
					checkboxCache[checkboxs.eq(i).attr('name')].push(checkboxs.eq(i).val());
				}
			}
			fieldData = $.extend({}, fieldData, checkboxCache || {});
		}

		if (type === 'serialize') {
			var fieldParameter = '';

			for (var i in fieldData) {
				fieldParameter += i + '=' + fieldData[i] + '&';
			}
			fieldData = fieldParameter;
		}

		return fieldData;
	}

	/**
	 * 判断一个对象是否为空对象
	 * @param  object  obj 		需要判断的对象
	 * @return boolean     		判断后的返回值
	 */
	Global.isObjectEmpty = function(obj) {

		for (var attr in obj) {
			return false;
		}

		return true;
	}

	/**
	 * 图片等比例缩放
	 * @param  string 	element 	图片容器
	 * @param  string 	src     	图片src
	 * @return null
	 */
	Global.scale = function(element, src, callback) {
		var containerWidth = $(element).width();
		var containerHeight = $(element).height();
		var cWidth = 0;
		var cHeight = 0;
		var image = new Image();

		// 触发加载事件
		image.onload = function() {

			if (image.width > image.height) {

				cHeight = image.height * containerWidth / image.width;

				cWidth = containerWidth;

			} else if (image.width < image.height) {

				cWidth = image.width * containerHeight / image.height;

				cHeight = containerHeight;

			} else {
				cWidth = containerWidth;
				cHeight = containerHeight;
			}

			var imgLeft = (containerWidth - cWidth) / 2;
			var imgTop = (containerHeight - cHeight) / 2;
			var imgWidth = cWidth;
			var imgHeight = cHeight;

			// 图片宽高自适应
			$(element).find('img').css({
				'position': 'absolute',
				'left': imgLeft,
				'top': imgTop,
				'width': imgWidth,
				'height': imgHeight
			});

			if (callback && typeof callback === 'function') {
				callback();
			}
		}

		// 加载图片src
		image.src = src;
	}

	/**
	 * 元素居中对齐,使用方法前,element元素为必为绝对定位或固定定位
	 * @param string 	element 	需要居中的元素（必填）
	 * @param string 	parent  	相对哪个父元素居中，默认为window
	 * @param string 	type    	左右垂直居中，值:center，align，centerAlign，默认为：centerAlign
	 */
	var index = 0; // 初始化
	Global.setCenter = function(element, parent, type) {
		var element = $(element);
		var parent = parent ? $(parent) : $(window);
		var type = type || 'centerAlign';

		var parentWidth = parent.width();
		var parentHeight = parent.height();

		var elementWidth = element.width();
		var elementHeight = element.height();

		if (type === 'center') {
			element.css({
				left: (parentWidth - elementWidth) * 0.5
			});
		} else if (type === 'middle') {
			element.css({
				top: (parentHeight - elementHeight) * 0.5
			});
		} else {
			element.css({
				left: (parentWidth - elementWidth) * 0.5,
				top: (parentHeight - elementHeight) * 0.5
			});
		}
	}

	/**
	 * 加载图片
	 * @param  object 	dom 	dom元素
	 * @return null
	 */
	Global.loadImage = function(src, callback) {
		var image = new Image();
		image.onload = function() {
			if (typeof callback !== 'undefined') {
				callback();
			}
		};
		image.src = src;
	}

})(jQuery);

/*ajax请求方法
 * type   类型
 * url   接口url
 * data 数据
 * callbackSuc  成功回调
 * callbackErr  失败回调
 *
 *
 * */
function getData(type, url, data, callbackSuc, callbackErr) {
	$.ajax({
		type: type,
		url: url,
		data: data,
		dataType: "json",
		header: {
			Authorization: '1111',
		},
		success: function(res) {
			callbackSuc(res);
		},
		error: function(res) {
			common.alert({
				mask: true,
				content: res.msg
			})
		}
	});
}
