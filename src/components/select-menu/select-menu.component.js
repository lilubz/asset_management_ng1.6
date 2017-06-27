(function() {
  'use strict';

  angular.module('app').component('selectMenu', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/select-menu/select-menu.template.html',
      controller: selectMenuCtrl,
      bindings: {
        searchInfo: '<',
        inventoryType: '<',
        selectList: '<',
        action: '&'
      }
    };

    return component;
  }

  selectMenuCtrl.$inject = [];

  /* @ngInject */
  function selectMenuCtrl() {
    var self = this
    self.$onChanges = function(changes) {
      if (changes.inventoryType && !changes.inventoryType.isFirstChange()) {
        self.action({
          searchType: '',
          searchKeyWord: '',
          assetCategory: '',
          departmentResponsibility: '',
          pageNum: 1,
          url: self.searchInfo.inventoryType
        });
      }
    }

  }
})();
