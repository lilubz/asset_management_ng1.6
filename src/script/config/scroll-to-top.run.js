(function() {

  'use strict';

  angular.module('app').run(scrollToTop);

  scrollToTop.$inject = ['$rootScope', '$state'];

  function scrollToTop($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(event, unfoundState, fromState, fromParams) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  };
})();
