(function() {
  'use strict';

  angular.module('app').component('register', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/sign-module/register/register.template.html',
      controller: registerCtrl
    };

    return component;
  }

  registerCtrl.$inject = [
    '$state',
    '$timeout',
    '$interval',
    'interfacesService',
    'httpService',
    'SweetAlert'
  ];

  /* @ngInject */
  function registerCtrl($state, $timeout, $interval, interfacesService, httpService, SweetAlert) {
    var self = this;
    var count = 60;
    self.time = '';
    self.user = {
      name: '',
      password: '',
      passwordConfirm: '',
      phone: '',
      message: ''
    };

    // function
    self.check = check
    self.countDown = countDown
    self.sendVerificationCode = sendVerificationCode
    self.register = register

    // 检查是否可以发送验证码
    function check() {
      if (!self.time) {
        self.sendVerificationCode()
      }
    };
    // 发送验证码倒计时
    function countDown() {
      count = 60;
      self.time = '60s';
      var interval = $interval(function() {
        if (count <= 0) {
          $interval.cancel(interval);
          self.time = '';
        } else {
          count--;
          self.time = count + 's';
        }
      }, 1000);
    }
    // 发送验证码
    function sendVerificationCode() {
      var data = {
        phone: self.user.phone
      }
      httpService.withCredentialsPostRequest(interfacesService.sendVerificationCode, data).then(function(response) {
        if (response.data.status === 0) {
          self.countDown();
        } else {
          SweetAlert.swal({title: "验证码发送失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 提交注册信息
    function register() {
      var user = self.user
      var data = {
        username: user.name,
        password: user.password,
        phone: user.phone,
        verificationCode: user.message
      }
      httpService.withCredentialsPostRequest(interfacesService.register, data).then(function(response) {
        if (response.data.status === 0) {
          SweetAlert.swal({
            title: "注册成功",
            text: "现在返回登录页面",
            type: "success",
            confirmButtonText: "去登陆"
          }, function() {
            $timeout(function() {
              $state.go('sign.login')
            }, 500)
          });
        } else {
          SweetAlert.swal({title: "注册失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
  }
})();
