(function() {
  'use strict';

  angular.module('app').factory('httpService', factory);

  factory.$inject = ['$http', '$q'];

  /* @ngInject */
  function factory($http, $q) {
    var service = {
      getRequest: getRequest,
      JSONPostRequest: JSONPostRequest,
      formPostRequest: formPostRequest,
      withCredentialsPostRequest: withCredentialsPostRequest,
      getTableInfoRequest: getTableInfoRequest
    };

    return service;

    // 重封装get请求
    function getRequest(url, data) {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: url,
        data: {
          params: data
        },
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    // 重封装post请求
    function JSONPostRequest(url, data) {
      var deferred = $q.defer();
      $http.post(url, JSON.stringify(data)).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    // 重封装post请求，参数序列化
    function formPostRequest(url, data) {
      var deferred = $q.defer();
      $http({
        method: "POST",
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charser=UTF-8'
        },
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    // 重封装post请求，允许cookie，参数序列化
    function withCredentialsPostRequest(url, data) {
      var deferred = $q.defer();
      $http({
        method: "POST",
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charser=UTF-8'
        },
        withCredentials: true,
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    // 重封装get请求，查询列表信息
    function getTableInfoRequest(url, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, pageSize) {
      var deferred = $q.defer();
      var assetId = '';
      var assetName = '';
      var brandSpecification = '';
      var personInCharge = '';
      switch (searchType) {
        case '':
          break;
        case 'assetId':
          assetId = (searchKeyWord !== '')
            ? searchKeyWord
            : '';
          break;
        case 'assetName':
          assetName = (searchKeyWord !== '')
            ? searchKeyWord
            : '';
          break;
        case 'personInCharge':
          personInCharge = (searchKeyWord !== '')
            ? searchKeyWord
            : '';
          break;
      };
      $http.get(url, {
        params: {
          'assetId': assetId,
          'assetName': assetName,
          'brandSpecification': brandSpecification,
          'personInCharge': personInCharge,
          'assetCategory': assetCategory,
          'departmentResponsibility': departmentResponsibility,
          'pageNum': pageNum,
          'pageSize': pageSize
        }
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

  }
})();
