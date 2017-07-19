(function() {
  'use strict';

  angular.module('app').component('assetInventory', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/asset-inventory/asset-inventory.template.html',
      controller: assetInventoryCtrl,
      bindings: {
        inventoryType: '<'
      }
    };

    return component;
  }

  assetInventoryCtrl.$inject = ['interfacesFactory', 'httpFactory', 'assetTableFactory', 'domFactory', 'SweetAlert'];

  /* @ngInject */
  function assetInventoryCtrl(interfacesFactory, httpFactory, assetTableFactory, domFactory, SweetAlert) {
    var self = this;
    self.data = {};
    self.theadInfo = {};
    self.loading = false;
    self.assetId = '';
    self.searchInfo = {
      searchType: '',
      searchKeyWord: '',
      assetCategory: '',
      departmentResponsibility: '',
      searchPageNumber: 1,
      searchPageSize: "10",
      inventoryType: 'getNotCompleteInventory'
    };
    self.lastSearchRecord = {
      searchType: '',
      searchKeyWord: '',
      assetCategory: '',
      departmentResponsibility: ''
    };
    self.modalInfo = {
      showCheckModal: false,
      showClearModal: false
    };

    // function
    self.showModal = showModal
    self.hideModal = hideModal
    self.searchPageNumberChange = searchPageNumberChange
    self.getInventory = getInventory
    self.clearInventoryAmount = clearInventoryAmount
    self.assetInventory = assetInventory

    self.getInventory('', '', '', '', 1, 'getNotCompleteInventory')

    // 显示模态框
    function showModal(name){
      self.modalInfo[name] = true;
      domFactory.modalOpen();
    }
    // 隐藏模态框
    function hideModal(name) {
      self.modalInfo[name] = false;
      if(name === 'showCheckModal'){
        self.assetId = '';
      }
      domFactory.modalHide();
    }
    // 换页
    function searchPageNumberChange(newValue) {
      if (newValue < 1)
        return;
      if (newValue > self.data.pages)
        return;
      self.searchInfo.searchPageNumber = newValue;
    }
    // 获取已完成/未完成资产盘点的资产信息列表
    function getInventory(searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, url) {
      var lastSearchRecord = self.lastSearchRecord;
      self.loading = true;
      httpFactory.getTableInfoRequest(interfacesFactory[url], searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, self.searchInfo.searchPageSize).then(function(response) {
        if (response.status == 200 && response.data.data.list) {
          lastSearchRecord.searchType = searchType;
          lastSearchRecord.searchKeyWord = searchKeyWord;
          lastSearchRecord.assetCategory = assetCategory;
          lastSearchRecord.departmentResponsibility = departmentResponsibility;
          self.data = response.data.data;
          if (self.searchInfo.searchPageNumber != response.data.data.pageNum && response.data.data.pageNum)
            self.searchInfo.searchPageNumber = response.data.data.pageNum;
          self.theadInfo = assetTableFactory.tableInitailize(self.data);
        } else {
          self.data.list = [];
        }
        self.loading = false;
      }).catch(function(response) {
        self.loading = false;
        SweetAlert.swal({title: "服务器出错了", text: response.statusText, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 清空资产盘点
    function clearInventoryAmount() {
      httpFactory.formPostRequest(interfacesFactory.clearInventoryAmount).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("清空资产盘点成功", response.data.msg, "success");
          self.hideModal('showClearModal');
          self.getInventory('', '', '', '', 1, 'getNotCompleteInventory');
          self.searchInfo.inventoryType = 'getNotCompleteInventory';
        } else {
          SweetAlert.swal({title: "清空资产盘点失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.hideModal('showClearModal');
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 盘点资产
    function assetInventory() {
      var data = {
        assetId: self.assetId
      };
      httpFactory.formPostRequest(interfacesFactory.assetsInventory, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("盘点资产成功", response.data.msg, "success");
          self.hideModal('showCheckModal');
          self.getInventory('', '', '', '', 1, 'getCompleteInventory');
          self.searchInfo.inventoryType = 'getCompleteInventory';
        } else {
          SweetAlert.swal({title: "盘点资产失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
  }
})();
