'use strict';

;
(function(win) {

	// 策略类
	var Strategy = {
		isEmpty: function(value, errorMsg) {
			if ($.trim(value) === '') {
				return errorMsg;
			}
		},
		minLength: function(value, length, errorMsg) {
			if (value.length < length) {
				return errorMsg;
			}
		},
		isMobile: function(value, errorMsg) {
			if (!/^1[0-9]{10}$/.test(Strategy.trim(value))) {
				return errorMsg;
			}
		},
		isNumber: function(value, errorMsg) {
			if (!/\d+/.test(Strategy.trim(value))) {
				return errorMsg;
			}
		},
		isActTime: function(value, errorMsg) {
			if(value!=''){
				if (!/^(\d{2}:\d{2}-\d{2}:\d{2})(,\d{2}:\d{2}-\d{2}:\d{2})*$/.test(Strategy.trim(value))) {
					return errorMsg;
				}
			}
		},
        isEmail: function(value, errorMsg) {
            if(value!=''){
                if (!/^.*@.*$/.test(Strategy.trim(value))) {
                    return errorMsg;
                }
            }
        },
		isRepeat: function(value, id, errorMsg) {
			if ($(id).val()!==value) {
				return errorMsg;
			}
		},
		isPrice: function(value, errorMsg) {
			if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(Strategy.trim(value))) {
				return errorMsg;
			}
		},
		isHref: function(value, errorMsg) {
			if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(Strategy.trim(value))) {
				return errorMsg;
			}
		},
		trim: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, '');
		}
	};

	/**
	 * 验证类
	 */
	function Validate() {
		this.cache = [];
		this.Strategy = Strategy;
	}

	/**
	 * 添加规则到内存中
	 * @param Array rule 规则列表
	 * @param object dom  JQ对象
	 */
	Validate.prototype.add = function(dom, rules) {
		var self = this;

		for (var i = 0, l = rules.length; i < l; i++) {
			(function(rule) {
				var strategyArr = rule.strategy.split('@'),
					msg = rule.msg;

				self.cache.push({
					dom: dom,
					strategyFun: function() {
						var strategy = strategyArr.shift();
						strategyArr.unshift(dom.val() || dom.html());
						strategyArr.push(msg);
						return Strategy[strategy].apply(dom, strategyArr);
					}
				});

			})(rules[i])
		}
	}

	/**
	 * 开始验证
	 * @param string returnValueType 错误信息的返回类型
	 * @return null
	 */
	Validate.prototype.start = function(returnValueType) {
		if (returnValueType === 'object') {
			var errorMsgObj = {};
			for (var i = 0, l = this.cache.length; i < l; i++) {
				var errorMsg = this.cache[i].strategyFun();
				if (errorMsg) {
					if (typeof errorMsgObj[this.cache[i].dom.attr('name')] === 'undefined') {
						errorMsgObj[this.cache[i].dom.attr('name')] = [];
					}

					errorMsgObj[this.cache[i].dom.attr('name')].push(errorMsg);
				}
			}
			
			return errorMsgObj;
		} else {
			for (var i = 0, l = this.cache.length; i < l; i++) {
				var errorMsg = this.cache[i].strategyFun();
				if (errorMsg) {
					return errorMsg;
				}
			}
		}

	}

	win.Validate = Validate;

})(window);