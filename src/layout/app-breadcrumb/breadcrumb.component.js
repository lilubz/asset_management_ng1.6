(function() {
  'use strict';

  angular.module('app').component('appBreadcrumb', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'layout/app-breadcrumb/breadcrumb.template.html',
      controller: appBreadcrumbCtrl
    };

    return component;
  }

  appBreadcrumbCtrl.$inject = ['breadcrumbService', '$scope'];

  /* @ngInject */
  function appBreadcrumbCtrl(breadcrumbService, $scope) {
    var self = this
    self.breadcrumbArr = breadcrumbService.updateBreadcrumbs()
    $scope.$on('$stateChangeSuccess', function() {
      self.breadcrumbArr = breadcrumbService.updateBreadcrumbs()
    })
  }
})();
