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

  wxAssetsInventoryCtrl.$inject = ['httpFactory', 'interfacesFactory', '$timeout'];

  /* @ngInject */
  function wxAssetsInventoryCtrl(httpFactory, interfacesFactory, $timeout) {
    var self = this;
    var appId = 'wxf1a816d98afbb951';
    var appSecret = '78cf52fda587e9c759cce185eb24d9ff';
    var configInfo;
    self.length = 0;
    self.assetInfo = {};
    self.input = '';
    self.shortMsgText = '';
    self.shortMsgShow = false;

    // function
    self.wxInit = wxInit;
    self.wxScan = wxScan;
    self.init = init;
    self.getConfigInfo = getConfigInfo;
    self.getAssetInfo = getAssetInfo;
    self.assetInventory = assetInventory;
    self.showShortMsg = showShortMsg;
    self.getConfigInfo();

    function wxInit() {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxf1a816d98afbb951', // 必填，公众号的唯一标识
        timestamp: configInfo.timestamp, // 必填，生成签名的时间戳
        nonceStr: configInfo.nonce, // 必填，生成签名的随机串
        signature: configInfo.signature, // 必填，签名，见附录1
        jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.error(function(res) {
        alert("出错了：" + res.errMsg);
      });
      wx.ready(function() {
        wx.checkJsApi({jsApiList: ['scanQRCode'], success: function(res) {}});
      })
    }

    //扫描二维码
    function wxScan() {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        desc: 'scanQRCode desc',
        scanType: [
          "qrCode", "barCode"
        ],
        success: function(res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          self.input = result;
          self.getAssetInfo();
        },
        error: function(res) {
          alert(JSON.stringify(res));
        }
      });
    }

    //插入jweixin
    function init() {
      var src = '<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>';
      var body = document.getElementsByTagName('body');
      var template = angular.element(src);
      angular.element(body).append(template);
    }

    //获取signature
    function getConfigInfo() {
      var url = "http://iecloud.top/guotaotest/weixin/getVerification.do";
      httpFactory.getRequest(url).then(function(response) {
        console.log(response)
        if (response.status === 200) {
        configInfo = response.data;
        self.wxInit()
        }
      }).catch(function(response) {})
    }

    //获取资产信息
    function getAssetInfo() {
      var data = {
        'assetId': self.input,
        'assetName': '',
        'brandSpecification': '',
        'personInCharge': '',
        'assetCategory': '',
        'departmentResponsibility': '',
        'pageNum': 1,
        'pageSize': 10
      }
      httpFactory.formPostRequest(interfacesFactory.getAssetUrl, data).then(function(response) {
        if (response.data.status === 0 && response.data.data.list.length > 0) {
          self.length = response.data.data.list.length;
          self.assetInfo = response.data.data.list[0];
        } else if (response.data.status === 0 && !response.data.data.list.length) {
          self.length = 0;
          self.assetInfo = {};
        }
      }).catch(function(response) {
        self.showShortMsg('出错了！');
      })
    }

    // 盘点资产
    function assetInventory() {
      var data = {
        assetId: self.input
      };
      httpFactory.formPostRequest(interfacesFactory.assetsInventory, data).then(function(response) {
        self.showShortMsg(response.data.msg);
      }).catch(function(response) {
        self.showShortMsg('出错了！');
      })
    }

    function showShortMsg(msg) {
      self.shortMsgText = msg;
      self.shortMsgShow = true;
      $timeout(function() {
        self.shortMsgShow = false;
      }, 1000);
    }

  }
})();
