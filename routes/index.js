var Pay_Config = require("../alipay_conf").Pay_Config;
var AlipaySubmit = require("../lib/pay_lib.js").AlipaySubmit;
var qs = require('querystring');
var fs = require('fs');
var https = require('https');
var xml2js = require('xml2js');


/*routes*/
exports.index = function (req, res) {
    res.render('order-pay');
};

exports.order_pay = function (req, res) {
    //获取基本参数
    var seller_email = "";
    var out_trade_no = new Date().getTime();
    var subject = "";
    var total_fee = "0.01";

    var req_id = Pay_Config.req_id;                //请求号
    var notify_url = Pay_Config.notify_url;        //服务器异步通知页面路径
    var call_back_url = Pay_Config.call_back_url;  //支付成功跳转页面路径
    var merchant_url = Pay_Config.merchant_url;    //操作中断返回地址


    var req_data = '<direct_trade_create_req><notify_url>' + notify_url + '</notify_url><call_back_url>' + call_back_url + '</call_back_url><seller_account_name>' + seller_email + '</seller_account_name><out_trade_no>' + out_trade_no + '</out_trade_no><subject>' + subject + '</subject><total_fee>' + total_fee + '</total_fee><merchant_url>' + merchant_url + '</merchant_url></direct_trade_create_req>';


    var para_token = {
        "service": "alipay.wap.trade.create.direct",
        "partner": Pay_Config.partner.trim(),
        "sec_id": Pay_Config.sign_type.trim(),
        "format": Pay_Config.format,
        "v": Pay_Config.v,
        "req_id": req_id,
        "req_data": req_data,
        "_input_charset": Pay_Config.input_charset.toLowerCase().trim()
    };


    //建立请求
    var wapalipay_submit = new AlipaySubmit(Pay_Config);
    var request_token_data = wapalipay_submit.buildRequestHttp(para_token);

    getHttpResponsePOST(Pay_Config.alipay_gateway_new, Pay_Config['cacert'], request_token_data, Pay_Config['input_charset']);
    function getHttpResponsePOST(url, cacert_url, request_data, input_charset) {
        var para_str = qs.stringify(request_data);
        var options = {
            host: "wappaygw.alipay.com",
            path: "/service/rest.htm",
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": para_str.length
            }
        };

        if (cacert_url) {
            options.cert = fs.readFileSync(cacert_url);
        }

        var res_xml = "";
        var request = https.request(options, function (res) {
            var body_str = '';
            res.setEncoding("utf-8");
            res.on("data", function (data) {
                body_str += data;
            });
            res.on("end", function () {
                res_xml = decodeURIComponent(body_str);
                res_xmlss(res_xml);
            })
        });
        request.on("error", function (err) {
            console.log(err);
        });
        request.write(para_str);
        request.end();
    }


    //获取token
    function res_xmlss(res_xml) {
        var res_array = res_xml.split("&");
        var xmlstr = res_array[0];
        xmlstr = xmlstr.substr(xmlstr.indexOf("=") + 1, xmlstr.length - 1);

        var token_number = "";

        var parser = new xml2js.Parser();
        parser.parseString(xmlstr, function (err, result) {
            var token_number = result.direct_trade_create_res.request_token[0];
            buildRequestForm(token_number);
        });
    }

    function buildRequestForm(token_number) {
        var req_data = '<auth_and_execute_req><request_token>' + token_number + '</request_token></auth_and_execute_req>';
        var parameter = {
            "service": "alipay.wap.auth.authAndExecute",
            "partner": Pay_Config['partner'],
            "sec_id": Pay_Config['sign_type'],
            "format": Pay_Config['format'],
            "v": Pay_Config['v'],
            "req_id": Pay_Config['req_id'],
            "req_data": req_data,
            "_input_charset": Pay_Config['input_charset']
        };

        var parafilter = wapalipay_submit.paraFilter(parameter);
        var parasort = wapalipay_submit.argSort(parafilter);
        var mysign = wapalipay_submit.buildRequestMysign(parasort);

        parasort['sign'] = mysign;
        getHttpResponseGet(Pay_Config.alipay_gateway_new, Pay_Config['cacert'], parasort, Pay_Config['input_charset']);
    }


    function getHttpResponseGet(url, cacert_url, request_data, input_charset) {
        var para_str = qs.stringify(request_data);
        var new_url = url + para_str;
        res.redirect(new_url);
    }
};

exports.pay_back = function (req, res) {
    res.render('order-back');
};
