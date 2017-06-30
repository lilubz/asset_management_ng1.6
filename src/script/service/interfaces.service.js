
(function() {
  'use strict';

  angular.module('app').factory('interfacesService', factory);

  factory.$inject = [];

  /* @ngInject */
  function factory() {
    var main = "http://192.168.1.56:8080/";
    // var backup = "http://192.168.1.107:28088/";
    var backup = "http://192.168.1.8:18080/";
    var register = "http://192.168.1.26:18080/";

    var api = backup;
    var interfaces = {
      //资产搜索
      'searchUrl': api + "asset/getAssetList.do",
      'searchByIdUrl': api + "asset/getAssetById.do",
      'addUrl': api + "asset/addAssetItem.do",
      'updateUrl': api + "asset/updateAssetInfo.do",
      'deleteUrl': api + "asset/deleteItem.do",
      'printQRcode': api + "asset/printQRcode.do",
      'importUrl': api + "asset/importAssetRecord.do",
      'exportUrl': api + "asset/exportStorageRecord.do",
      'getAssetUrl': api + "asset/getAssetSelect.do",
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
      'register': register + "user/register.do",
      'login': register + "user/login.do",
      'logout': register + "user/logout.do",
      'resetPassword': register + "user/reset_password.do",
      'sendVerificationCode': register + "user/sendVerificationCode.do",
      'sendResetVerificationCode': register + "user/sendResetVerificationCode.do"
    };

    return interfaces;
  }
})();
