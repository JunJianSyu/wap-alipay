var payConfig = {
    partner: "",//you partner
    key:"",//you key
    private_key_path:"key/rsa_private_key.pem",//可选的配置
    ali_public_key_path:"key/alipay_public_key.pem",//可选的配置
    sign_type:"MD5",
    input_charset:"utf-8",
    cacert: process.cwd() + "/cacert.pem",
    transport:"http",
    format:"xml",
    v:"2.0",
    req_id:new Date().getTime(),
    notify_url:"http://127.0.0.1:1992/paynotify",
    call_back_url:"http://127.0.0.1:1992/payreturn",
    merchant_url:"http://127.0.0.1:1992/",
    alipay_gateway_new:'http://wappaygw.alipay.com/service/rest.htm?'
};

exports.payConfig = payConfig;
