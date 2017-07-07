(function() {
  'use strict';

  angular.module('app').component('login', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/sign-module/login/login.template.html',
      controller: loginCtrl
    };

    return component;
  }

  loginCtrl.$inject = ['$state', 'interfacesService', 'httpService', 'cacheService', 'SweetAlert'];

  /* @ngInject */
  function loginCtrl($state, interfacesService, httpService, cacheService, SweetAlert) {
    var self = this;
    self.user = {
      password: '',
      phone: ''
    };

    // function
    self.login = login

    // 提交登陆信息
    function login() {
      var user = self.user
      var data = {
        password: user.password,
        phone: user.phone
      }
      httpService.withCredentialsPostRequest(interfacesService.login, data).then(function(response) {
        if (response.data.status === 0) {
          var expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 7);
          cacheService.put('identity', angular.toJson(response.data.data), {'expires': expireDate.toUTCString()});
          $state.go('main.assetManagement.assetSearch');
        } else {
          SweetAlert.swal({title: "登陆失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }

  }
})();
