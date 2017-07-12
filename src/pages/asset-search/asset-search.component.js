(function() {
  'use strict';

  angular.module('app').component('assetSearch', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/asset-search/asset-search.template.html',
      controller: assetSearchCtrl
    };

    return component;
  }

  assetSearchCtrl.$inject = [
    'interfacesService',
    'httpService',
    'assetTableService',
    'domFactory',
    'FileUploader',
    'SweetAlert'
  ];

  /* @ngInject */
  function assetSearchCtrl(interfacesService, httpService, assetTableService, domFactory, FileUploader, SweetAlert) {
    var self = this;
    self.data = {};
    self.theadInfo = {};
    self.loading = false;
    self.selectedItem = {};
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
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showImportModal: false,
      showExportModal: false,
      importModal: {
        currentStep: 1
      },
      modal: {
        assetId: '',
        assetName: '',
        assetCategory: '',
        brandSpecification: '',
        unitMeasurement: '',
        bookAmount: '',
        inventoryAmount: '',
        storageLocation: '',
        departmentResponsibility: '',
        personInCharge: '',
        statusUsage: ''
      }
    };
    // 新建angular-file-upload实例
    self.uploader = new FileUploader({
      url: interfacesService.importUrl, method: 'POST',
      // removeAfterUpload: true,
      // queueLimit: 1,
    });

    // function
    self.showModal = showModal;
    self.showEditModal = showEditModal;
    self.showDeleteModal = showDeleteModal;
    self.hideModal = hideModal;
    self.clean = clean;
    self.searchPageNumberChange = searchPageNumberChange;
    self.searchItem = searchItem;
    self.addItem = addItem;
    self.editItem = editItem;
    self.deleteItem = deleteItem;
    self.printQRcode = printQRcode;

    // 导入资产信息相关操作
    self.importModalInitialize = importModalInitialize;
    self.stepChange = stepChange;
    self.importAssetList = importAssetList;
    self.exportAssetList = exportAssetList;
    // angular-file-upload钩子函数
    self.uploader.onAfterAddingFile = onAfterAddingFile;
    self.uploader.onSuccessItem = onSuccessItem;

    self.searchItem('', '', '', '', 1);

    // 显示模态框
    function showModal(name){
      self.modalInfo[name] = true;
      domFactory.modalOpen();
    }

    // 显示编辑模态框
    function showEditModal(item) {
      var modalInfo = self.modalInfo;
      modalInfo.showEditModal = true;
      domFactory.modalOpen();
      angular.forEach(modalInfo.modal, function(value, key) {
        modalInfo.modal[key] = item[key];
      });
    }
    // 显示删除模态框
    function showDeleteModal(item) {
      self.modalInfo.showDeleteModal = true;
      domFactory.modalOpen();
      self.selectedItem = item;
    }
    // 隐藏模态框
    function hideModal(name) {
      self.modalInfo[name] = false;
      if(name === 'showAddModal' || name === 'showEditModal'){
        self.clean();
      }
      domFactory.modalHide();
    }
    // 清理modal信息
    function clean() {
      var modalInfo = self.modalInfo;
      angular.forEach(modalInfo.modal, function(value, key) {
        modalInfo.modal[key] = '';
      });
    }
    // 换页
    function searchPageNumberChange(newValue) {
      if (newValue < 1)
        return;
      if (newValue > self.data.pages)
        return;
      self.searchInfo.searchPageNumber = newValue;
    }
    // 查询信息
    function searchItem(searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum) {
      var lastSearchRecord = self.lastSearchRecord;
      self.loading = true;
      httpService.getTableInfoRequest(interfacesService.getAssetUrl, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, self.searchInfo.searchPageSize).then(function(response) {
        if (response.status == 200 && response.data.data.list) {
          lastSearchRecord.searchType = searchType;
          lastSearchRecord.searchKeyWord = searchKeyWord;
          lastSearchRecord.assetCategory = assetCategory;
          lastSearchRecord.departmentResponsibility = departmentResponsibility;
          self.data = response.data.data;
          if (self.searchInfo.searchPageNumber != response.data.data.pageNum && response.data.data.pageNum) {
            self.searchInfo.searchPageNumber = response.data.data.pageNum;
          }
          self.theadInfo = assetTableService.tableInitailize(self.data);
        } else {
          self.data.list = [];
        }
        self.loading = false;
      }).catch(function(response) {
        self.loading = false;
        SweetAlert.swal({title: "服务器出错了", text: response.statusText, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 添加信息
    function addItem() {
      var lastSearchRecord = self.lastSearchRecord;
      var modalInfo = self.modalInfo;
      if(!modalInfo.modal.bookAmount || modalInfo.modal.bookAmount<0){
        modalInfo.modal.bookAmount = 0;
      }
      if(!modalInfo.modal.inventoryAmount || modalInfo.modal.inventoryAmount<0){
        modalInfo.modal.inventoryAmount = 0;
      }
      httpService.formPostRequest(interfacesService.addUrl, self.modalInfo.modal).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("添加成功", response.data.msg, "success");
          self.hideModal('showAddModal');
          self.searchItem(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, 1);
        } else {
          SweetAlert.swal({title: "添加失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 编辑信息
    function editItem() {
      var lastSearchRecord = self.lastSearchRecord;
      var modalInfo = self.modalInfo;
      if(!modalInfo.modal.bookAmount || modalInfo.modal.bookAmount<0){
        modalInfo.modal.bookAmount = 0;
      }
      if(!modalInfo.modal.inventoryAmount || modalInfo.modal.inventoryAmount<0){
        modalInfo.modal.inventoryAmount = 0;
      }
      httpService.formPostRequest(interfacesService.updateUrl, self.modalInfo.modal).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("编辑成功", response.data.msg, "success");
          self.hideModal('showEditModal');
          self.searchItem(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "编辑失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 删除信息
    function deleteItem() {
      var lastSearchRecord = self.lastSearchRecord;
      var data = {
        'assetId': self.selectedItem['assetId']
      };
      self.hideModal('showDeleteModal');
      self.selectedItem = {};
      httpService.formPostRequest(interfacesService.deleteUrl, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.searchItem(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 打印资产二维码
    function printQRcode(assetId, assetName) {
      var data = {
        'assetId': assetId,
        'assetName': assetName
      };
      httpService.formPostRequest(interfacesService.printQRcode, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("打印成功", response.data.msg, "success");
        } else {
          SweetAlert.swal({title: "打印失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 初始化导入弹出框
    function importModalInitialize() {
      self.hideModal('showImportModal');
      self.modalInfo.importModal.currentStep = 1;
      if (self.uploader.queue.length)
        self.uploader.clearQueue();
      }
    // 导入弹出框下一步、上一步切换
    function stepChange(count) {
      var modalInfo = self.modalInfo;
      if (modalInfo.importModal.currentStep === 1 && count === -1)
        return;
      if (modalInfo.importModal.currentStep === 3 && count === 1)
        return;
      modalInfo.importModal.currentStep += count;
    }
    // 上传导入
    function importAssetList() {
      var uploader = self.uploader;
      var len = uploader.queue.length;
      var array = uploader.queue[0].file.name.split('.');
      var fileType = array[array.length - 1];
      if ((fileType !== 'xls' && fileType !== 'xlsx') || len !== 1) {
        SweetAlert.swal({title: "出错了", text: '只能上传一个以xls或xlsx结尾的文件', type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        return;
      } else {
        uploader.queue[0].upload();
      }
    }
    // 下载导出
    function exportAssetList() {
      var lastSearchRecord = self.lastSearchRecord,
        searchType = '',
        searchKeyWord = '',
        assetCategory = '',
        departmentResponsibility = '',
        str = '?';
      if (lastSearchRecord.searchType && lastSearchRecord.searchKeyWord) {
        searchType = lastSearchRecord.searchType;
        searchKeyWord = lastSearchRecord.searchKeyWord;
        str += (searchType + '=' + searchKeyWord + '&');
      }
      if (lastSearchRecord.assetCategory) {
        assetCategory = lastSearchRecord.assetCategory;
        str += ('assetCategory=' + assetCategory + '&');
      }
      if (lastSearchRecord.departmentResponsibility) {
        departmentResponsibility = lastSearchRecord.departmentResponsibility;
        str += ('departmentResponsibility=' + departmentResponsibility + '&');
      }

      self.exportUrl = interfacesService.exportUrl + str;
      self.showModal('showExportModal');
    }
    // angular-file-upload钩子函数，添加上传文件后触发
    function onAfterAddingFile(fileItem) {
      var uploader = self.uploader;
      var len = uploader.queue.length;
      var file = uploader.queue[len - 1];
      if (len > 1) {
        uploader.clearQueue();
        uploader.queue.push(file);
      }
    }
    // angular-file-upload钩子函数，上传成功后触发
    function onSuccessItem(fileItem, response, status, headers) {
      if (response.status == 0) {
        var data = response.data;
        var read = data.split('excel中读取')[1].split('条记录')[0];
        var write = data.split('写入数据库')[1].split('条记录')[0];
        if (read == 0) {
          SweetAlert.swal({title: "上传失败", text: '上传成功0条，上传表格格式/内容错误', type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.importModalInitialize();
          return;
        }
        if (read != 0 && write == 0) {
          SweetAlert.swal({title: "上传失败", text: '上传成功0条，可能由于资产ID已经存在', type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.importModalInitialize();
          return;
        }
        if (read != write) {
          SweetAlert.swal({
            title: "部分上传成功",
            text: '上传成功' + write + '条，失败' + (read - write) + '条，可能由于资产ID已经存在',
            type: "warning",
            confirmButtonColor: "#F8BB86",
            confirmButtonText: "确定"
          });
          self.importModalInitialize();
          self.searchItem('', '', '', '', 1);
          return;
        }
        if (read == write && write > 0) {
          SweetAlert.swal("上传成功", '批量添加资产信息成功', "success");
          self.importModalInitialize();
          self.searchItem('', '', '', '', 1);
          return;
        }
      } else {
        SweetAlert.swal({title: "上传失败", text: response.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        self.importModalInitialize();
      }
    }

  }
})();
