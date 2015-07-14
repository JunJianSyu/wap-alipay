var CryptoJS = require("crypto-js");
/*
 * 支付构造函数
 * @param {object} 配置参数列表
 */
function AlipaySubmit(alipay_config) {
    /*wap支付宝网关地址*/
    this.alipay_gateway_new = 'http://wappaygw.alipay.com/service/rest.htm?';
    this.alipay_config = alipay_config;
}

AlipaySubmit.prototype = {
    buildRequestHttp: function (para_token) {
        var request_data = this.buildRequestPara(para_token);
        return request_data;
    },
    buildRequestPara: function (para_token) {
        var new_para = this.paraFilter(para_token);
        var para_sort = this.argSort(new_para);
        var mysign = this.buildRequestMysign(para_sort);
        para_sort['sign'] = mysign;
        return para_sort;
    },
    paraFilter: function (para_token) {
        var para_filter = {};
        for (var key in para_token) {
            if (key == 'sign' || key == 'sign_type' || para_token[key] == '') {
                continue;
            }
            else {
                para_filter[key] = para_token[key];
            }
        }
        return para_filter;
    },
    argSort: function (para_token) {
        var result = {};
        var keys = Object.keys(para_token).sort();
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            result[k] = para_token[k];
        }
        return result;

    },
    buildRequestMysign: function (para_token) {
        var prestr = this.createLinkstring(para_token);
        var sign = "";
        var sign_type = this.alipay_config['sign_type'];
        if (sign_type == "MD5") {
            sign = this.md5Sign(prestr, this.alipay_config['key']);
        } else {
            sign = "";
        }
        return sign;
    },
    createLinkstring: function (para_token) {
        var ls = '';
        for (var k in para_token) {
            ls = ls + k + '=' + para_token[k] + '&';
        }
        ls = ls.substring(0, ls.length - 1);
        return ls;
    },
    md5Sign: function (prestr, key) {
        prestr += key;
        var md5 = CryptoJS.MD5(prestr) + '';
        return md5;
    }
};


exports.AlipaySubmit = AlipaySubmit;