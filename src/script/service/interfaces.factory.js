
(function() {
  'use strict';

  angular.module('app').factory('interfacesFactory', factory);

  factory.$inject = [];

  /* @ngInject */
  function factory() {
    // var main = "http://192.168.1.107:3001/";
    var main = "http://192.168.1.124:3001/";
    // var main = "http://localhost:80/guotaotest/";
    // var main = "http://47.92.121.244:80/guotaotest/";
    var api = main;
    var interfaces = {
      //资产搜索
      'getAssetUrl': api + "asset/getAssetSelect.do",
      'addUrl': api + "asset/addAssetItem.do",
      'updateUrl': api + "asset/updateAssetInfo.do",
      'deleteUrl': api + "asset/deleteItem.do",
      'printQRcode': api + "asset/printQRcode.do",
      'importUrl': api + "asset/importAssetRecord.do",
      'exportUrl': api + "asset/exportStorageRecord.do",
      //资产盘点
      'clearInventoryAmount': api + "asset/clearInventoryAmount.do",
      'assetsInventory': api + "asset/assetsInventory.do",
      'getCompleteInventory': api + "asset/getCompleteInventory.do",
      'getNotCompleteInventory': api + "asset/getNotCompleteInventory.do",
      //资产恢复
      'getAssetRecycle': api + "asset/getAssetRecycle.do",
      'deleteAssetRecycleItem': api + "asset/deleteAssetRecycleItem.do",
      'deleteAssetRecycleMultiItem': api + "asset/deleteAssetRecycleMultiItem.do",
      'notExistItemInAssetTable': api + "asset/notExistItemInAssetTable.do",
      'notExistMultiItemInAssetTable': api + "asset/notExistMultiItemInAssetTable.do",
      'recycleAssetItem': api + "asset/recycleAssetItem.do",
      'recycleAssetMultiItem': api + "asset/recycleAssetMultiItem.do",
      //类属管理
      'getDepartment': api + "manage/department/getDepartment.do",
      'addDepartment': api + "manage/department/addDepartment.do",
      'updateDepartment': api + "manage/department/updateDepartment.do",
      'deleteDepartment': api + "manage/department/deleteDepartment.do",
      'getCategory': api + "manage/assetCategory/getCategory.do",
      'addCategory': api + "manage/assetCategory/addCategory.do",
      'updateCategory': api + "manage/assetCategory/updateCategory.do",
      'deleteCategory': api + "manage/assetCategory/deleteCategory.do",
      //注册登陆模块
      'register': main + "user/register.do",
      'login': main + "user/login.do",
      'logout': main + "user/logout.do",
      'resetPassword': main + "user/reset_password.do",
      'sendVerificationCode': main + "user/sendVerificationCode.do",
      'sendResetVerificationCode': main + "user/sendResetVerificationCode.do"
    };

    return interfaces;
  }
})();
