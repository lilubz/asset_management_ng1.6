(function() {
  'use strict';

  angular.module('app').component('assetTable', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/asset-table/asset-table.template.html',
      controller: assetTableCtrl,
      bindings: {
        data: '<',
        theadInfo: '<',
        firstAction: '&',
        secondAction: '&',
        thirdAction: '&',
        hasCheckbox: '<',
        isSelectedArray: '<'
      },
      transclude: {
        'checkbox': '?tableCheckbox',
        'button': '?tableButton'
      }
    };

    return component;
  }

  assetTableCtrl.$inject = [];

  /* @ngInject */
  function assetTableCtrl() {}
})();
