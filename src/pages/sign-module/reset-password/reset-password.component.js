(function() {
  'use strict';

  angular.module('app').component('resetPassword', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/sign-module/reset-password/reset-password.template.html',
      controller: resetPasswordCtrl
    };

    return component;
  }

  resetPasswordCtrl.$inject = ['$state', '$interval', 'interfacesService', 'httpService', 'SweetAlert'];

  /* @ngInject */
  function resetPasswordCtrl($state, $interval, interfacesService, httpService, SweetAlert) {
    var self = this;
    var count = 60;
    self.time = '';
    self.user = {
      password: '',
      passwordConfirm: '',
      phone: '',
      message: ''
    };

    // function
    self.check = check
    self.countDown = countDown
    self.sendResetVerificationCode = sendResetVerificationCode
    self.resetPassword = resetPassword

    // 检查是否可以发送验证码
    function check() {
      if (!self.time) {
        self.sendResetVerificationCode()
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
    function sendResetVerificationCode() {
      var data = {
        phone: self.user.phone
      }
      httpService.formPostRequest(interfacesService.sendResetVerificationCode, data).then(function(response) {
        if (response.data.status === 0) {
          self.countDown();
        } else {
          SweetAlert.swal({title: "验证码发送失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 重置密码
    function resetPassword() {
      var user = self.user
      var data = {
        password: user.password,
        phone: user.phone,
        verificationCode: user.message
      }
      httpService.formPostRequest(interfacesService.resetPassword, data).then(function(response) {
        if (response.data.status === 0) {
          SweetAlert.swal({
            title: "重置密码成功",
            text: "现在返回登录页面",
            type: "success",
            confirmButtonText: "去登陆"
          }, function() {
            $state.go('sign.login')
          });
        } else {
          SweetAlert.swal({title: "重置密码失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
  }
})();
