var Pay_Config = {
    partner: "",//you partner
    key: "",//you key
    sign_type: "MD5",
    input_charset: "utf-8",
    cacert: process.cwd() + "/cacert.pem",
    transport: "http",
    format: "xml",
    v: "2.0",
    req_id: new Date().getTime(),
    notify_url: "http://127.0.0.1:8111/order-pay",
    call_back_url: "http://127.0.0.1:8111/order-back",
    merchant_url: "http://127.0.0.1:8111/",
    alipay_gateway_new: 'http://wappaygw.alipay.com/service/rest.htm?'
};

exports.Pay_Config = Pay_Config;
