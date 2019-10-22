// 初始化时间
var now = new Date();
var nowYear = now.getFullYear();
var nowMonth = now.getMonth() + 1;
var nowDate = now.getDate();
var nowHour = now.getHours();
var nowMintue = now.getMinutes();
var nowSecond = now.getSeconds();

/**
 * 设置日期控件
 * @param string element 日期控件元素*/
function setDateControl(element) {
    var showDateDom = $(element);


    showDateDom.attr('data-year', nowYear);
    showDateDom.attr('data-month', nowMonth);
    showDateDom.attr('data-date', nowDate);

    $('.container').on('click',element, function() {
        var self = $(this);
        var oneLevelId = showDateDom.attr('data-year');
        var twoLevelId = showDateDom.attr('data-month');
        var threeLevelId = showDateDom.attr('data-date');
        var iosSelect = new IosSelect(3, [yearData, monthData,dateData], {
            title: '',
            itemHeight: 77,
            headerHeight: 77,
            itemShowCount: 5,
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            showAnimate: true,
            showLoading: true,
            callback: function(selectOneObj, selectTwoObj,selectThreeObj) {
                self.html(selectOneObj.id + '-' + FormatDate(selectTwoObj.id) + '-' + FormatDate(selectThreeObj.id));
            }
        });
    });
}

function FormatDate(number) {
    var number = parseInt(number);

    return number < 10 ? '0' + number : number;
}

// 数据初始化
function formatYear(nowYear) {
    var arr = [];
    for (var i = nowYear - 35; i <= nowYear + 35; i++) {
        arr.push({
            id: i + '',
            value: i + '年'
        });
    }
    return arr;
}

function formatMonth() {
    var arr = [];
    for (var i = 1; i <= 12; i++) {
        arr.push({
            id: i + '',
            value: i < 10 ? '0' + i + '月' : i + '月'
        });
    }
    return arr;
}

function formatDate(count) {
    var arr = [];
    for (var i = 1; i <= count; i++) {
        arr.push({
            id: i + '',
            value: i < 10 ? '0' + i + '日' : i + '日'
        });
    }
    return arr;
}

function formatHour() {
    var arr = [];
    for (var i = 0; i <= 23; i++) {
        arr.push({
            id: i + '',
            value: i < 10 ? '0' + i + '时' : i + '时'
        });
    }
    return arr;
}

function formatMintue() {
    var arr = [];
    for (var i = 0; i <= 59; i++) {
        arr.push({
            id: i + '',
            value: i < 10 ? '0' + i + '分' : i + '分'
        });
    }
    return arr;
}

function formatSecond() {
    var arr = [];
    for (var i = 0; i <= 59; i++) {
        arr.push({
            id: i + '',
            value: i < 10 ? '0' + i + '秒' : i + '秒'
        });
    }
    return arr;
}

function formatQuarter() {
    var arr = [
        {
            id:1,
            value:'第一'
        }, {
            id:2,
            value:'第二'
        }, {
            id:3,
            value:'第三'
        }, {
            id:4,
            value:'第四'
        },
    ];

    return arr;
}

var yearData = function(callback) {
    callback(formatYear(nowYear))
};
var monthData = function(year, callback) {
    callback(formatMonth());
};
var dateData = function(year, month, callback) {
    if (/^(1|3|5|7|8|10|12)$/.test(month)) {
        callback(formatDate(31));
    } else if (/^(4|6|9|11)$/.test(month)) {
        callback(formatDate(30));
    } else if (/^2$/.test(month)) {
        if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
            callback(formatDate(29));
        } else {
            callback(formatDate(28));
        }
    } else {
        throw new Error('month is illegal');
    }
};

var hourData = function(year, month,date,callback) {
    callback(formatHour());
};

var mintueData = function(year, month,date,hour,callback) {
    callback(formatMintue());
};

var secondData = function(year, month,date,hour,mintue,callback) {
    callback(formatSecond());
};
