(function() {
  'use strict';

  angular.module('app').component('pagination', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/pagination/pagination.template.html',
      controller: paginationCtrl,
      bindings: {
        data: '<',
        searchInfo: '<',
        searchPageSize: '<',
        searchPageNumber: '<',
        searchUrl: '<',
        lastSearchRecord: '<',
        searchPageNumberChange: '&',
        searchAction: '&'
      }
    };

    return component;
  }

  paginationCtrl.$inject = [];

  /* @ngInject */
  function paginationCtrl() {
    var self = this;
    self.$onChanges = function(changes) {
      if (changes.searchPageSize && !changes.searchPageSize.isFirstChange()) {
        self.searchAction({
          searchType: self.lastSearchRecord.searchType,
          searchKeyWord: self.lastSearchRecord.searchKeyWord,
          assetCategory: self.lastSearchRecord.assetCategory,
          departmentResponsibility: self.lastSearchRecord.departmentResponsibility,
          pageNum: 1,
          url: self.searchUrl
        });
      }
      if (changes.searchPageNumber && !changes.searchPageNumber.isFirstChange()) {
        self.searchAction({
          searchType: self.lastSearchRecord.searchType,
          searchKeyWord: self.lastSearchRecord.searchKeyWord,
          assetCategory: self.lastSearchRecord.assetCategory,
          departmentResponsibility: self.lastSearchRecord.departmentResponsibility,
          pageNum: self.searchInfo.searchPageNumber,
          url: self.searchUrl
        });
      }
    }
  }
})();
