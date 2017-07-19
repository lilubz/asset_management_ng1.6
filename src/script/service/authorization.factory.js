(function() {
  'use strict';

  angular.module('app').factory('authorizationFactory', factory);

  factory.$inject = ['$rootScope', '$state', '$q', 'cacheFactory'];

  /* @ngInject */
  function factory($rootScope, $state, $q, cacheFactory) {
    var identity = undefined;
    var service = {
      checkLogin: checkLogin,
      getUserInfo: getUserInfo,
    };

    return service;
    // 检查是否登录
    function checkLogin() {
    var deferred = $q.defer();
    var promise = deferred.promise;
    identity = angular.fromJson(cacheFactory.get("identity"));
    deferred.resolve(identity);
    return promise.then(function(id) {
      if (!id) {
        $state.go('sign.login');
      }
    });
  }
  // 取得用户信息
  function getUserInfo(){
    var userInfo;
    userInfo = angular.fromJson(cacheFactory.get("identity"));
    if(userInfo){
      return userInfo
    }
  }
}
})();
