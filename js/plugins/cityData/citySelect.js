/**
 * 省市联动
 * @param cfg {object} 参数
 * @param cfg.province {object} 省份jq对象
 * @param cfg.city {object} 城市jq对象
 * @param cfg.area {object} 地区jq对象
 * @param cfg.cityCon {object} 城市标签容器jq对象
 * @param cfg.areaCon {object} 地区标签容器jq对象
 * @param cfg.def {Array} 默认显示的地区
 */
var citySelect = function (cfg) {
    var self = this;

    self.provinceEle = cfg.province;
    self.cityEle = cfg.city;
    self.areaEle = cfg.area;

    self.cityCon = cfg.cityCon;
    self.areaCon = cfg.areaCon;

    self.def = cfg.def || [];

    self.init(self.def[0], self.def[1], self.def[2]);
    self.initEvent();
};

/**
 * @desc 初始化，添加省市区
 * @param defProvince
 * @param defCity
 * @param defArea
 */
citySelect.prototype.init = function (defProvince, defCity, defArea) {
    var self = this;

    var province = "";
    var city = "";
    var area = "";

    var cityList;
    var areaList;

    var pNum;

    for (var i = 0; i < cityData.length; i++) {
        if (cityData[i].name == "请选择") {
            province += '<option value="">请选择</option>';
        } else if (cityData[i].name == defProvince) {
            province += '<option value="' + cityData[i].name + '" selected>' + cityData[i].name + '</option>';

            cityList = cityData[i].sub;
            pNum = i;
        } else {
            province += '<option value="' + cityData[i].name + '">' + cityData[i].name + '</option>';
        }
    }

    self.provinceEle.html(province);

    if (defCity) {
        for (var j = 0; j < cityList.length; j++) {
            if (cityList[j].name == "请选择") {
                city += '<option value="">请选择</option>';
            } else if (cityList[j].name == defCity) {
                city += '<option value="' + cityList[j].name + '" selected>' + cityList[j].name + '</option>';

                areaList = cityList[j].sub;
            } else {
                city += '<option value="' + cityList[j].name + '">' + cityList[j].name + '</option>';
            }
        }

        if (self.cityCon) {
            self.cityCon.show();
        }
        self.cityEle.html(city).data("pNum", pNum).show();
    }

    if (defArea) {
        for (var k = 0; k < areaList.length; k++) {
            if (areaList[k].name == "请选择") {
                area += '<option value="">请选择</option>';
            } else if (areaList[k].name == defArea) {
                area += '<option value="' + areaList[k].name + '" selected>' + areaList[k].name + '</option>';
            } else {
                area += '<option value="' + areaList[k].name + '">' + areaList[k].name + '</option>';
            }
        }

        if (self.areaCon) {
            self.areaCon.show();
        }
        self.areaEle.html(area).show();
    }
};

citySelect.prototype.initEvent = function () {
    var self = this;

    self.provinceEle.on("change", function () {
        selectProvince(self, $(this))
    });
    self.cityEle.on("change", function () {
        selectCity(self, $(this));
    });
};

function selectProvince(self, ele) {
    var province = ele.val();

    var cityList;
    var city = "";

    var pNum;

    if (province == "") {
        self.cityEle.html("").hide();
        self.areaEle.html("").hide();

        if (self.cityCon) {
            self.cityCon.hide();
        }
        if (self.areaCon) {
            self.areaCon.hide();
        }

        return;
    }

    for (var i = 0; i < cityData.length; i++) {
        if (cityData[i].name == province) {
            cityList = cityData[i].sub;
            pNum = i;
        }
    }

    for (var j = 0; j < cityList.length; j++) {
        if (cityList[j].name == "请选择") {
            city += '<option value="">请选择</option>';
        } else {
            city += '<option value="' + cityList[j].name + '">' + cityList[j].name + '</option>';
        }
    }

    self.cityEle.html(city).data("pNum", pNum).show();
    self.areaEle.html("").hide();

    if (self.cityCon) {
        self.cityCon.show();
    }
    if (self.areaCon) {
        self.areaCon.hide();
    }
}

function selectCity(self, ele) {
    var city = ele.val();

    var pNum = ele.data("pNum");

    var cityList;
    var areaList;
    var area = "";

    cityList = cityData[pNum].sub;

    for (var i = 0; i < cityList.length; i++) {
        if (cityList[i].name == city) {
            areaList = cityList[i].sub;
            if (!areaList) {
                areaList = [];
            }
        }
    }

    if (areaList.length == 0 || city == "") {
        if (self.areaCon) {
            self.areaCon.hide();
        }
        self.areaEle.html("").hide();
        return;
    }

    for (var j = 0; j < areaList.length; j++) {
        if (areaList[j].name == "请选择") {
            area += '<option value="">请选择</option>';
        } else {
            area += '<option value="' + areaList[j].name + '">' + areaList[j].name + '</option>';
        }
    }

    self.areaEle.html(area).show();
    if (self.areaCon) {
        self.areaCon.show();
    }
}