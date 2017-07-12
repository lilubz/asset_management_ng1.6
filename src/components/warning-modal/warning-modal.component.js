(function() {
  'use strict';

  angular.module('app').component('warningModal', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/warning-modal/warning-modal.template.html',
      controller: warningModalCtrl,
      bindings: {
        modalTitle: '@',
        showModal: '<',
        hideModal: '&'
      },
      transclude: {
        'div': '?modalDiv',
        'text': '?modalText',
        'reminder': '?modalReminder'
      }
    };

    return component;
  }

  warningModalCtrl.$inject = [];

  /* @ngInject */
  function warningModalCtrl() {}
})();
