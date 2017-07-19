(function() {
  'use strict';

  angular.module('app').component('wxAssetsInventory', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/wx-assets-inventory/wx-assets-inventory.template.html',
      controller: wxAssetsInventoryCtrl
    };

    return component;
  }

  wxAssetsInventoryCtrl.$inject = ['httpFactory'];

  /* @ngInject */
  function wxAssetsInventoryCtrl(httpFactory) {
    var self = this;
    var appId = 'wxf1a816d98afbb951';
    var appSecret = '78cf52fda587e9c759cce185eb24d9ff';
    var token;
    self.input = '';

    // function
    self.init = init;
    self.getToken = getToken;
    self.getTicket = getTicket;
    self.wxScan = wxScan;
    // self.init();
    // self.getToken();

    //插入jweixin
    function init() {
      var src = '<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>';
      var body = document.getElementsByTagName('body');
      var template = angular.element(src);
      angular.element(body).append(template);
    }

    //获取access_token
    function getToken() {
      var url = "https://api.weixin.qq.com/cgi-bin/token";
      var data = {
        grant_type: 'client_credential',
        appid: appId,
        appSecret: appSecret
      }
      httpFactory.getRequest(url, data).then(function(response) {
        cosnole.log(response)
        // if (response.data.status == 0) {
        // token = ;
        //self.getTicket()
        // }
      }).catch(function(response) {})
    }

    //获取jsapi_ticket
    function getTicket() {
      var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket";
      var data = {
        access_token: token,
        type: 'jsapi'
      }
      httpFactory.getRequest(url, data).then(function(response) {
        cosnole.log(response)
        // if (response.data.status == 0) {
        //
        // }
      }).catch(function(response) {})
    }

    //扫描二维码
    function wxScan() {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: [
          "qrCode", "barCode"
        ],
        success: function(res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          self.input = result;
          alert("扫描成功");
        }
      });
    }

    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wxf1a816d98afbb951', // 必填，公众号的唯一标识
      timestamp: '', // 必填，生成签名的时间戳
      nonceStr: '', // 必填，生成签名的随机串
      signature: '', // 必填，签名，见附录1
      jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.error(function(res) {
      alert("出错了：" + res.errMsg);
    });

    wx.ready(function() {
      wx.checkJsApi({jsApiList: ['scanQRCode'], success: function(res) {}});
    })

  }
})();
