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

  appHeadCtrl.$inject = [];

  /* @ngInject */
  function appHeadCtrl() {
    this.$onInit = function() {
      this.showLogout = false
    }
  }
})();
