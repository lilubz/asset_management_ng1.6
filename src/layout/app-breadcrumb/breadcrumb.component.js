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

  appBreadcrumbCtrl.$inject = ['breadcrumbFactory', '$scope'];

  /* @ngInject */
  function appBreadcrumbCtrl(breadcrumbFactory, $scope) {
    var self = this
    self.breadcrumbArr = breadcrumbFactory.updateBreadcrumbs()
    $scope.$on('$stateChangeSuccess', function() {
      self.breadcrumbArr = breadcrumbFactory.updateBreadcrumbs()
    })
  }
})();
