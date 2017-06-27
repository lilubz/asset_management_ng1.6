(function() {
  'use strict';

  angular.module('app').component('assetRecovery', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/asset-recovery/asset-recovery.template.html',
      controller: assetRecoveryCtrl
    };

    return component;
  }

  assetRecoveryCtrl.$inject = ['interfacesService', 'httpService', 'assetTableService', 'SweetAlert'];

  /* @ngInject */
  function assetRecoveryCtrl(interfacesService, httpService, assetTableService, SweetAlert) {
    var self = this;
    self.data = {};
    self.theadInfo = {};
    self.loading = false;
    self.selectAll = false;
    self.selectedItem = {};
    self.selectedArray = [];
    self.isSelectedArray = [];
    self.searchInfo = {
      searchType: '',
      searchKeyWord: '',
      assetCategory: '',
      departmentResponsibility: '',
      searchPageNumber: 1,
      searchPageSize: "10"
    };
    self.lastSearchRecord = {
      searchType: '',
      searchKeyWord: '',
      assetCategory: '',
      departmentResponsibility: ''
    };
    self.modalInfo = {
      showSingleDeleteModal: false,
      showMultipleDeleteModal: false
    };

    // function
    self.searchPageNumberChange = searchPageNumberChange
    self.showSingleDeleteModal = showSingleDeleteModal
    self.showMultipleDeleteModal = showMultipleDeleteModal
    self.selectAllCheckBox = selectAllCheckBox
    self.selectSingleCheckBox = selectSingleCheckBox
    self.getAssetRecycle = getAssetRecycle
    self.notExistItemInAssetTable = notExistItemInAssetTable
    self.recycleAssetItem = recycleAssetItem
    self.deleteAssetRecycleItem = deleteAssetRecycleItem
    self.createDataList = createDataList
    self.notExistMultiItemInAssetTable = notExistMultiItemInAssetTable
    self.recycleAssetMultiItem = recycleAssetMultiItem
    self.deleteAssetRecycleMultiItem = deleteAssetRecycleMultiItem

    self.getAssetRecycle('', '', '', '', 1);

    // 换页
    function searchPageNumberChange(newValue) {
      if (newValue < 1)
        return;
      if (newValue > self.data.pages)
        return;
      self.searchInfo.searchPageNumber = newValue;
    }
    // 显示删除模态框
    function showSingleDeleteModal(item) {
      self.modalInfo.showSingleDeleteModal = true;
      self.selectedItem = item;
    }
    // 显示批量删除模态框
    function showMultipleDeleteModal() {
      self.selectedArray = self.createDataList();
      if (!self.selectedArray.length)
        return;
      self.modalInfo.showMultipleDeleteModal = true;
    }
    // 全选/全不选
    function selectAllCheckBox() {
      var selectAll = self.selectAll;
      // self.isSelectedArray[0] = selectAll;
      angular.forEach(self.isSelectedArray, function(data, index, array) {
        array[index] = selectAll;
      });
    }
    // 选择列表中checkbox时触发
    function selectSingleCheckBox() {
      if (self.selectAll === true)
        self.selectAll = false;
      if (self.selectAll === false) {
        self.selectAll = (self.isSelectedArray.indexOf(false) === -1)
          ? true
          : false;
      }
    }
    // 获取资产回收站列表
    function getAssetRecycle(searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum) {
      var lastSearchRecord = self.lastSearchRecord;
      self.loading = true;
      httpService.getTableInfoRequest(interfacesService.getAssetRecycle, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, self.searchInfo.searchPageSize).then(function(response) {
        if (response.status == 200 && response.data.data.list) {
          lastSearchRecord.searchType = searchType;
          lastSearchRecord.searchKeyWord = searchKeyWord;
          lastSearchRecord.assetCategory = assetCategory;
          lastSearchRecord.departmentResponsibility = departmentResponsibility;
          self.data = response.data.data;
          if (self.searchInfo.searchPageNumber != response.data.data.pageNum && response.data.data.pageNum)
            self.searchInfo.searchPageNumber = response.data.data.pageNum;
          self.theadInfo = assetTableService.tableInitailize(self.data);
          self.selectAll = false;
          self.isSelectedArray = [];
          for (var i = 0; i < self.data.list.length; i++) {
            self.isSelectedArray.push(false);
          };
        } else {
          self.data.list = [];
        }
        self.loading = false;
      }).catch(function(response) {
        self.loading = false;
        SweetAlert.swal({title: "服务器出错了", text: response.statusText, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 查重资产表中是否存在单条资产记录
    function notExistItemInAssetTable(id) {
      var data = {
        assetId: id
      };
      httpService.formPostRequest(interfacesService.notExistItemInAssetTable, data).then(function(response) {
        if (response.data.status == 0) {
          self.recycleAssetItem(data);
        } else {
          SweetAlert.swal({
            title: '如果恢复，则现资产表中相同资产编号的资产将被覆盖',
            text: response.data.msg,
            type: "warning",
            confirmButtonColor: "#F8BB86",
            confirmButtonText: "确定恢复",
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: true
          }, function(isConfirm) {
            if (isConfirm)
              self.recycleAssetItem(data);
            }
          );
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 恢复资产回收站中单条记录
    function recycleAssetItem(data) {
      var lastSearchRecord = self.lastSearchRecord;
      httpService.formPostRequest(interfacesService.recycleAssetItem, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("恢复成功", response.data.msg, "success");
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "恢复失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 删除资产回收站单条记录
    function deleteAssetRecycleItem() {
      var lastSearchRecord = self.lastSearchRecord;
      var data = {
        assetId: self.selectedItem['assetId']
      };
      httpService.formPostRequest(interfacesService.deleteAssetRecycleItem, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.modalInfo.showSingleDeleteModal = false;
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showSingleDeleteModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 根据已选内容生成assetIdList
    function createDataList() {
      var assetIdList = [];
      var dataList = self.data.list;
      var isSelectedArray = self.isSelectedArray;
      if (isSelectedArray.indexOf(true) == -1) {
        SweetAlert.swal({title: "恢复失败", text: "未选择任何资产记录", type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        return;
      }
      angular.forEach(self.isSelectedArray, function(data, index, array) {
        if (data === true) {
          assetIdList.push(dataList[index].assetId)
        };
      });
      return assetIdList;
    }
    // 查重资产表中是否存在多条资产记录
    function notExistMultiItemInAssetTable() {
      var assetIdList = self.createDataList();
      if (!assetIdList)
        return;
      httpService.JSONPostRequest(interfacesService.notExistMultiItemInAssetTable, assetIdList).then(function(response) {
        if (response.data.status == 0) {
          self.recycleAssetMultiItem(assetIdList);
        } else {
          SweetAlert.swal({
            title: '如果恢复，则下列资产编号的资产信息将被覆盖',
            text: response.data.data,
            type: "warning",
            confirmButtonColor: "#F8BB86",
            confirmButtonText: "确定恢复",
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: true
          }, function(isConfirm) {
            if (isConfirm)
              self.recycleAssetMultiItem(assetIdList);
            }
          );
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 恢复资产回收站中多条记录
    function recycleAssetMultiItem(assetIdList) {
      var lastSearchRecord = self.lastSearchRecord;
      httpService.JSONPostRequest(interfacesService.recycleAssetMultiItem, assetIdList).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("恢复成功", response.data.msg, "success");
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "恢复失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 删除资产回收站多条记录
    function deleteAssetRecycleMultiItem() {
      var lastSearchRecord = self.lastSearchRecord;
      httpService.JSONPostRequest(interfacesService.deleteAssetRecycleMultiItem, self.selectedArray).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.modalInfo.showMultipleDeleteModal = false;
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showMultipleDeleteModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
  }
})();
