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

  assetRecoveryCtrl.$inject = ['interfacesFactory', 'httpFactory', 'assetTableFactory', 'domFactory', 'SweetAlert'];

  /* @ngInject */
  function assetRecoveryCtrl(interfacesFactory, httpFactory, assetTableFactory, domFactory, SweetAlert) {
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
      showDeleteModal: false,
      showMultipleDeleteModal: false
    };

    // function
    self.searchPageNumberChange = searchPageNumberChange
    self.showModal = showModal
    self.hideModal = hideModal
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
    // 显示模态框
    function showModal(name, item) {
      if(name === 'showDeleteModal'){
        self.modalInfo.showDeleteModal = true;
        domFactory.modalOpen();
        self.selectedItem = item;
      }
      if(name === 'showMultipleDeleteModal'){
        self.selectedArray = self.createDataList();
        if (!self.selectedArray.length)
          return;
        self.modalInfo.showMultipleDeleteModal = true;
        domFactory.modalOpen();
      }
    }
    // 隐藏模态框
    function hideModal(name) {
      self.modalInfo[name] = false;
      domFactory.modalHide();
    }
    // 全选/全不选
    function selectAllCheckBox() {
      var selectAll = self.selectAll;
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
      httpFactory.getTableInfoRequest(interfacesFactory.getAssetRecycle, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, self.searchInfo.searchPageSize).then(function(response) {
        if (response.status == 200 && response.data.data.list) {
          lastSearchRecord.searchType = searchType;
          lastSearchRecord.searchKeyWord = searchKeyWord;
          lastSearchRecord.assetCategory = assetCategory;
          lastSearchRecord.departmentResponsibility = departmentResponsibility;
          self.data = response.data.data;
          if (self.searchInfo.searchPageNumber != response.data.data.pageNum && response.data.data.pageNum)
            self.searchInfo.searchPageNumber = response.data.data.pageNum;
          self.theadInfo = assetTableFactory.tableInitailize(self.data);
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
      httpFactory.formPostRequest(interfacesFactory.notExistItemInAssetTable, data).then(function(response) {
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
      httpFactory.formPostRequest(interfacesFactory.recycleAssetItem, data).then(function(response) {
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
      httpFactory.formPostRequest(interfacesFactory.deleteAssetRecycleItem, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.hideModal('showDeleteModal');
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.hideModal('showDeleteModal');
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
      httpFactory.JSONPostRequest(interfacesFactory.notExistMultiItemInAssetTable, assetIdList).then(function(response) {
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
      httpFactory.JSONPostRequest(interfacesFactory.recycleAssetMultiItem, assetIdList).then(function(response) {
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
      httpFactory.JSONPostRequest(interfacesFactory.deleteAssetRecycleMultiItem, self.selectedArray).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.hideModal('showMultipleDeleteModal');
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.hideModal('showMultipleDeleteModal');
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
  }
})();
