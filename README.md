# Alipay
Nodejs 支付宝支付

# git获取
```bash
$ git clone git@github.com:JunJianSyu/wap-alipay.git
```

修改一些基本参数，即可运行。

###### 参数修改模板 alipay_conf.js

```js
var Pay_Config = {
    partner: "你的 partner",
    key: "你的 key",
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
```

###### 参数修改模板 alipay_conf.js

```js
    //获取基本参数
    var seller_email = "商家支付宝账户";
    var out_trade_no = new Date().getTime();
    var subject = "商品名称 根据业务参数自行获取";
    var total_fee = "商品金额";
```

如果你在此例子中遇到一些问题，请提出。我会尽快给出答复，如果你觉得此Example对你有帮助，请start一下。谢谢！