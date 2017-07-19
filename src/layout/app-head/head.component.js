(function() {
  'use strict';

  angular.module('app').component('appHead', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'layout/app-head/head.template.html',
      controller: appHeadCtrl
    };

    return component;
  }

  appHeadCtrl.$inject = ['$state', 'interfacesFactory', 'httpFactory', 'cacheFactory', 'authorizationFactory'];

  /* @ngInject */
  function appHeadCtrl($state, interfacesFactory, httpFactory, cacheFactory, authorizationFactory) {
    var self = this;
    self.userInfo = authorizationFactory.getUserInfo();

    // function
    self.logout = logout;

    // 登出
    function logout() {
      httpFactory.getRequest(interfacesFactory.logout).then(function(response) {
        if (response.data.status === 0) {
          cacheFactory.remove('identity');
          $state.go('sign.login');
        } else {
          SweetAlert.swal({title: "登出失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
  }
})();
