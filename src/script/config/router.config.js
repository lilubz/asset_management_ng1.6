(function() {
  'use strict';

  angular.module('app').config(appRouter);

  appRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

  /* @ngInject */
  function appRouter($stateProvider, $urlRouterProvider) {
    var signState = {
      abstract: true,
      templateUrl: 'pages/sign-module/sign/sign.template.html'
    }
    var loginState = {
      url: '^/login',
      template: '<login></login>'
    }
    var registerState = {
      url: '^/register',
      template: '<register></register>'
    }
    var resetPasswordState = {
      url: '^/resetPassword',
      template: '<reset-password></reset-password>'
    }
    var mainState = {
      abstract: true,
      templateUrl: 'pages/main/main.template.html',
      resolve: {
        checkLogin: [
          'authorizationFactory',
          function(authorizationFactory) {
            return authorizationFactory.checkLogin()
          }
        ]
      }
    }
    var assetManagementState = {
      // url: '^/assetManagement',
      template: '<div ui-view></div>',
      breadcrumb: {
        label: "资产管理",
        parent: "main"
      }
    }
    var assetSearch = {
      url: '^/assetSearch',
      template: '<asset-search></asset-search>',
      breadcrumb: {
        label: "资产查询",
        parent: "main.assetManagement"
      }
    }
    var assetRecovery = {
      url: '^/assetRecovery',
      template: '<asset-recovery></asset-recovery>',
      breadcrumb: {
        label: "资产恢复",
        parent: "main.assetManagement"
      }
    }
    var assetsInventory = {
      url: '^/assetsInventory',
      template: '<asset-inventory inventory-type="&quot;getNotCompleteInventory&quot;"></asset-inventory>',
      breadcrumb: {
        label: "资产盘点",
        parent: "main.assetManagement"
      }
    }
    var cdManagement = {
      url: '^/cdManagement',
      template: '<cd-management></cd-management>',
      breadcrumb: {
        label: "类属管理",
        parent: "main"
      }
    }
    var wxAssetsInventory = {
      url: '^/wxAssetsInventory',
      template: '<wx-assets-inventory></wx-assets-inventory>'
    }
    $stateProvider.state('sign', signState);
    $stateProvider.state('sign.login', loginState);
    $stateProvider.state('sign.register', registerState);
    $stateProvider.state('sign.resetPassword', resetPasswordState);
    $stateProvider.state('main', mainState);
    $stateProvider.state('main.assetManagement', assetManagementState);
    $stateProvider.state('main.assetManagement.assetSearch', assetSearch);
    $stateProvider.state('main.assetManagement.assetRecovery', assetRecovery);
    $stateProvider.state('main.assetManagement.assetsInventory', assetsInventory);
    $stateProvider.state('main.cdManagement', cdManagement);
    $stateProvider.state('wxAssetsInventory', wxAssetsInventory);
    // $stateProvider.state('main.404', errorState);
    $urlRouterProvider.otherwise('assetSearch');
    // $urlRouterProvider.otherwise('wxAssetsInventory');

  }
})();
