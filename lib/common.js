window.common = {};

// var accountId = '1';
var accountId = Global.getUrlParam('accountId');
(function ($) {
    /**
     * @func common.alert()
     * @desc 弹框组件
     * @param cfg
     * @param cfg.title {string} 弹框标题，默认为没有标题
     * @param cfg.content {string} 弹框内容
     * @param cfg.width {string} 弹框宽度
     * @param cfg.dialog {boolean} 是否是对话框，默认为否
     * @param cfg.ok {function} 点击确定的回调函数
     * @param cfg.okValue {string} 确定按钮的文字，默认为确定
     * @param cfg.cancel {function} 点击取消的回调函数
     * @param cfg.cancelValue {string} 取消按钮的文字，默认为取消
     * @param cfg.textAlign {string} 文字方向，默认为居中
     * @param cfg.mask {boolean} 是否有遮罩层，默认为没有
     */
    common.alert = function (cfg) {
        //设置默认值
        var ok = cfg.ok || function () {
            };
        var okValue = cfg.okValue || "确定";
        var cancel = cfg.cancel || function () {
            };
        var cancelValue = cfg.cancelValue || "取消";
        var dialog = cfg.dialog || false;
        var textAlign = cfg.textAlign || "center";
        var width = cfg.width || "70%";

        //生成随机ID
        var id = Math.ceil(Math.random() * 1000000);

        var con = '<div class="alert" style="position: fixed;width: 100%;height: 100%;top: 0;left: 0;';

        //判断是否添加遮罩层
        if (cfg.mask) {
            con += 'background-color: rgba(0, 0, 0, 0.5);';
        }

        con += '-webkit-transition: ease-out 0.5s; -moz-transition: ease-out 0.5s;-ms-transition: ease-out 0.3s; -o-transition: ease-out 0.3s;' +
            'transition: ease-out 0.3s;z-index:9999;opacity:0"><div style="position: absolute;top: 40%;left:50%;width: ' + width +
            ';background-color: #fff;border-radius: 10px;overflow: hidden;-webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);' +
            '-ms-transform: translate(-50%,-50%); -o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);box-shadow: 3px 3px 10px #666">';

        //判断是否有标题
        if (cfg.title) {
            con += '<div style="font-size: 23px;line-height: 60px;text-align: center;color: #333;border-bottom: 1px solid #ccc;">' + cfg.title + '</div>' +
                '<div style="font-size: 23px;color: #555;padding:30px 10px;text-align:' + textAlign + ';border-bottom: 1px solid #ccc;' +
                'word-break:break-all;word-wrap:break-word;position:relative">' + cfg.content + '</div>';
        } else {
            con += '<div style="font-size: 23px;color: #555;padding: 30px 10px;text-align:' + textAlign + ';border-bottom: 1px solid #ccc;' +
                'word-break:break-all;word-wrap:break-word;position:relative">' + cfg.content + '</div>';
        }

        //判断弹框类型，如果为对话框则显示确定和取消按钮
        if (dialog) {
            con += '<div><button style="width: 50%;height: 60px;border: none;background: none;font-size: 23px;padding: 0;outline: none" ' +
                'id="dCancel' + id + '">' + cancelValue + '</button><button style="width: 50%;height: 60px;border: none;background: #f68100;' +
                'font-size: 26px;padding: 0;color: #fff;outline: none;" id="dConfirm' + id + '">' + okValue + '</button></div></div>';
        } else {
            con += '<div><button style="width: 100%;height: 60px;border: none;background: none;font-size: 26px;' +
                'padding: 0;color: #60a0ff;outline: none;" id="dConfirm' + id + '">' + okValue + '</button></div></div></div>';
        }

        //向页面添加弹框
        $("body").append(con);

        //延时添加过渡效果
        setTimeout(function () {
            $(".alert").css("opacity", 1);
        }, 30);

        //取消按钮事件
        $("#dCancel" + id).on("click", function () {
            cancel();
            $(this).parents(".alert").remove();
        });

        //确定按钮事件
        $("#dConfirm" + id).on("click", function () {


            var state = ok();
            if (state !== false) {
                $(this).parents(".alert").remove();
            }
        });
    };


    

 
    /**
     * @func getData
     * @desc 异步获取数据
     * @param {string} url 异步请求的地址
     * @param {object} data 请求的参数
     * @param {function} callback 回调函数
     * @returns {boolean}
     * @example
     * Common.getData("/test",“{}”,function(data){})
     */
    common.getData = function (url, data, callback) {
        $.ajax({
            type: "GET",
            data: data,
            url: url,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (rep) {
                callback.apply(this, arguments);
            },
            error: function (rep) {
                callback.apply(this, arguments);
            }
        });
    };

    /**
     * @func GetUrlString
     * @desc 获取url传的值
     * @param {string} name 需要获取的字段名
     */
    common.getUrlString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var str = window.location.search.substr(1).match(reg);
        if (str) {
            return str[2];
        }
        else {
            return null;
        }
    };

    /**
     * @func render
     * @desc 页面渲染
     * @param {object} cfg
     * @param {object} cfg.tmpl dotjs的模板对象
     * @param {object} cfg.data 渲染模板所需要数据
     * @param {string} cfg.container 渲染的模板将被插入的容器选择器
     * @param {boolean} cfg.overwrite 是否清空容器原有内容 默认不清空
     * @param {boolean} cfg.append 是否在末尾添加
     * @param {function} cfg.callback 渲染完成的回调方法
     * @example
     * common.render(cfg);
     */
    common.render = function (cfg) {
        var callback = cfg.callback || function () {
            };
        var append = cfg.append || true;

        var tmpl = doT.template(cfg.tmpl.text());

        if (cfg.overwrite) {
            cfg.container.empty();
        }
        if (tmpl) {
            if (append) {
                cfg.container.append(tmpl(cfg.data));
            }
            else {
                cfg.container.html(tmpl(cfg.data));
            }
        }
        else {
            console.log("对应的模块不存在!");
        }
        callback();
    };

})(jQuery);