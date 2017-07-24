(function() {
  'use strict';

  angular.module('app').component('signHead', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'layout/sign-head/sign-head.template.html',
      controller: signHeadCtrl,
      bindings: {}
    };

    return component;
  }

  signHeadCtrl.$inject = [];

  /* @ngInject */
  function signHeadCtrl() {}
})();
