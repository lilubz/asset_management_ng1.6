(function() {
  'use strict';

  angular.module('app').config(appRouter);

  appRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

  /* @ngInject */
  function appRouter($stateProvider, $urlRouterProvider) {
    var homepage = {
      abstract: true,
      templateUrl: 'pages/sign-module/homepage/homepage.template.html'
    }
    var signState = {
      template: '<sign></sign>'
    }
    var about = {
      url: '^/about',
      template: '<about></about>'
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
    $stateProvider.state('homepage', homepage);
    $stateProvider.state('homepage.about', about);
    $stateProvider.state('homepage.sign', signState);
    $stateProvider.state('homepage.sign.login', loginState);
    $stateProvider.state('homepage.sign.register', registerState);
    $stateProvider.state('homepage.sign.resetPassword', resetPasswordState);
    $stateProvider.state('main', mainState);
    $stateProvider.state('main.assetManagement', assetManagementState);
    $stateProvider.state('main.assetManagement.assetSearch', assetSearch);
    $stateProvider.state('main.assetManagement.assetRecovery', assetRecovery);
    $stateProvider.state('main.assetManagement.assetsInventory', assetsInventory);
    $stateProvider.state('main.cdManagement', cdManagement);
    $stateProvider.state('wxAssetsInventory', wxAssetsInventory);
    $urlRouterProvider.otherwise('assetSearch');
  }
})();
