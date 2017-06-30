(function() {
  'use strict';

  angular.module('app').factory('authorizationService', factory);

  factory.$inject = ['$rootScope', '$state', '$q', 'cacheService'];

  /* @ngInject */
  function factory($rootScope, $state, $q, cacheService) {
    // var identity = undefined;
    var service = {
      checkLogin: checkLogin
    };

    return service;

    function checkLogin() {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var identity = angular.fromJson(cacheService.get("identity"));
      deferred.resolve(identity);
      return promise.then(function(id) {
        if (!id) {
          $state.go('sign.login');
        }
      });
    }
  }
})();
