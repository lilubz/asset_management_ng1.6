(function() {
  'use strict';

  angular.module('app').component('assetModal', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/asset-modal/asset-modal.template.html',
      controller: assetModalCtrl,
      bindings: {
        modalTitle: '@',
        btnName: '@',
        isDisable: '<',
        modal: '<',
        showModal: '<',
        hideModal: '&',
        submit: "&"
      }
    };

    return component;
  }

  assetModalCtrl.$inject = [];

  /* @ngInject */
  function assetModalCtrl() {}
})();
