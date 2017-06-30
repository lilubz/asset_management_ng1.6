(function() {
  'use strict';

  angular.module('app').factory('cacheService', factory);

  factory.$inject = ['$cookies'];

  /* @ngInject */
  function factory($cookies) {
    var service = {
      put: put,
      get: get,
      remove: remove
    };

    return service;

    function put(key, value) {
      $cookies.put(key, value);
    }
    function get(key) {
      return $cookies.get(key);
    }
    function remove(key) {
      $cookies.remove(key);
    }
  }
})();
