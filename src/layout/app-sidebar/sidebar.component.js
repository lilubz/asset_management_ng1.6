
(function() {
  'use strict';

  angular.module('app').component('appSidebar', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'layout/app-sidebar/sidebar.template.html',
      controller: appSidebarCtrl
    };

    return component;
  }

  appSidebarCtrl.$inject = ['$rootScope', '$state', '$scope'];

  /* @ngInject */
  function appSidebarCtrl($rootScope, $state, $scope) {
    var self = this
    self.currentState = $state.$current.name
    $scope.$on('$stateChangeSuccess', function() {
      self.currentState = $state.$current.name
    })
  }
})();
