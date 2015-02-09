var CryptoJS = require("crypto-js");
/*
 * 支付构造函数
 * @param {object} 配置参数列表
 */
function AlipaySubmit(alipay_config) {
    /*wap支付宝网关地址*/
    this.alipay_gateway_new = 'http://wappaygw.alipay.com/service/rest.htm?';
    this.alipay_config = alipay_config;
    console.log("init 构造函数");
}

AlipaySubmit.prototype = {
    /*
     * 建立请求，以模拟远程HTTP的POST请求方式构造并获取支付宝的处理结果
     * @param {object} para_token
     */
    buildRequestHttp: function (para_token) {
        console.log("init 建立请求");
        var request_data = this.buildRequestPara(para_token);
        return request_data;
    },
    /*
     * 生成支付宝需要的参数数组
     * @param {object} para_token
     */
    buildRequestPara: function (para_token) {
        console.log("init 生成参数数组");
        var new_para = this.paraFilter(para_token);

        var para_sort = this.argSort(new_para);

        var mysign = this.buildRequestMysign(para_sort);

        para_sort['sign'] = mysign;
        return para_sort;

    },
    /*
     * 除去对象中的空值和签名参数
     * @param {object} para_token
     */
    paraFilter: function (para_token) {
        console.log("init 除去对象中的空值和签名参数");
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
    /*
     * para_token对象排序
     * @param {object} para_token
     */
    argSort: function (para_token) {
        console.log("init para_token对象排序");
        var result = {};
        var keys = Object.keys(para_token).sort();
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            result[k] = para_token[k];
        }
        return result;

    },
    /*
     * 生成签名结果
     * @param {object} para_token
     */
    buildRequestMysign: function (para_token) {
        console.log("init 生成签名结果");
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
    /*
     * 拼接字符串
     * @param {object} para_token
     */
    createLinkstring: function (para_token) {
        console.log("init 拼接字符串");
        var ls = '';
        for (var k in para_token) {
            ls = ls + k + '=' + para_token[k] + '&';
        }
        ls = ls.substring(0, ls.length - 1);
        return ls;
    },
    /*
     * 签名字符串
     * @param prestr 需要签名的字符串
     * @param key 私钥
     * return 签名结果
     */
    md5Sign: function (prestr, key) {
        prestr += key;
        var md5 = CryptoJS.MD5(prestr) + '';
        return md5;
    }
};


exports.AlipaySubmit = AlipaySubmit;