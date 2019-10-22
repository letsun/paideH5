
var doc=$(document);
var intDiff = 10;//验证码倒计时总秒数量
var backInterval;

$(function () {

    /**
     * @desc 获取验证码事件
     */
    doc.on("click",'#ver-codeBtn',function(e) {
		 var self = $(this);
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
			console.log(typeof intDiff);
			if(typeof timer(intDiff) != "undefined"){
			    self.html("验证码" + "(" + timer(intDiff) + ")");
			}
		}
    });
});



/* 验证码倒计时函数 -- 参数initTim为秒数 */
function timer(initTim){

    $('#ver-codeBtn').html("验证码" + "(" + initTim + "s)").css("background", "#eee");
	$('#ver-codeBtn').html("验证码" + "(" + initTim + "s)").css("color", "#333");
    backInterval = window.setInterval(function(){

        initTim --;

        if (initTim <= 9) {
            initTim = '0' + initTim;
        }

        $('#ver-codeBtn').html("验证码" + "(" + initTim + "s)");
		
        if(initTim == 0) {
            $("#ver-codeBtn").html("获取验证码").css("background", "#ffda31");
            $('#ver-codeBtn').removeClass('active');
            clearInterval(backInterval);
            intDiff = parseInt(10);
        }

    }, 1000);
}

/* 表单提交函数 */
function formSub() {
    var storename = $("#storename").val(),
        username = $("#username").val(),
        phone = $("#phone").val(),
        verifyCode = $("#verifyCode").val(),
        detailAddress = $("#detailAddress").val();

    var reg=/^0?1[3|4|5|8][0-9]\d{8}$/;

    if($.trim(storename) == "") {
        common.alert({
            mask:true,
            content: "请输入店名"
        });
        return false;
    }

    if($.trim(username) == "") {
        common.alert({
            mask:true,
            content: "请输入姓名"
        });
        return false;
    }

    if($.trim(phone) == "") {
        common.alert({
            mask:true,
            content: "请输入手机号"
        });
        return false;
    }

    if (!reg.test($.trim(phone))) {
        common.alert({
            mask:true,
            content: "请输入正确的手机号"
        });
        return false;
    }

    if($.trim(verifyCode) == "") {
        common.alert({
            mask:true,
            content: "请输入验证码"
        });
        return false;
    }

    if($.trim(detailAddress) == "") {
        common.alert({
            mask:true,
            content: "请输入详情地址"
        });
        return false;
    }

    window.location.href="./注册成功.html";
}

