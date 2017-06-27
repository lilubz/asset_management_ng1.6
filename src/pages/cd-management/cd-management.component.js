(function() {
  'use strict';

  angular.module('app').component('cdManagement', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/cd-management/cd-management.template.html',
      controller: cdManagementCtrl
    };

    return component;
  }

  cdManagementCtrl.$inject = ['interfacesService', 'httpService', 'SweetAlert'];

  /* @ngInject */
  function cdManagementCtrl(interfacesService, httpService, SweetAlert) {
    var self = this
    self.departmentLoading = false;
    self.categoryLoading = false;
    self.departmentArray = [];
    self.categoryArray = [];
    self.deptShowPencilLable = 999;
    self.catShowPencilLable = 999;
    self.addDepartmentInput = '';
    self.addCategoryInput = '';
    self.selectedItem = {};
    self.modalInfo = {
      showDepartmentModal: false,
      showCategoryModal: false
    };

    // function
    self.showModal = showModal
    self.getDatas = getDatas
    self.deleteDatas = deleteDatas
    self.addDepartment = addDepartment
    self.updateDepartment = updateDepartment
    self.addCategory = addCategory
    self.updateCategory = updateCategory

    self.getDatas('department', 'Department')
    self.getDatas('category', 'Category')

    // 显示模态框
    function showModal(item, param) {
      self.modalInfo['show' + param + 'Modal'] = true;
      self.selectedItem = item;
    };
    // 获取
    function getDatas(param, Param) {
      self[param + 'Loading'] = true;
      httpService.getRequest(interfacesService['get' + Param]).then(function(response) {
        if (response.data.status == 0) {
          self[param + 'Array'] = response.data.data;
        } else {
          self[param + 'Array'] = [];
        }
        self[param + 'Loading'] = false;
      }).catch(function(response) {
        self[param + 'Loading'] = false;
        SweetAlert.swal({title: "服务器出错了", text: response.statusText, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    };
    // 删除
    function deleteDatas(param, Param) {
      var data = {
        'id': self.selectedItem['id']
      };
      httpService.formPostRequest(interfacesService['delete' + Param], data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.modalInfo['show' + Param + 'Modal'] = false;
          self.getDatas(param, Param);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo['show' + Param + 'Modal'] = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    };
    // 增加
    function addDepartment() {
      var data = {
        'departmentName': self.addDepartmentInput
      };
      httpService.formPostRequest(interfacesService.addDepartment, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("增加成功", response.data.msg, "success");
          self.modalInfo.showDepartmentModal = false;
          self.getDatas('department', 'Department');
        } else {
          SweetAlert.swal({title: "增加失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showDepartmentModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    };
    // 编辑
    function updateDepartment() {
      var data = {
        'id': self.selectedItem['id'],
        'departmentName': self.selectedItem['departmentName']
      };
      httpService.formPostRequest(interfacesService.updateDepartment, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("编辑成功", response.data.msg, "success");
          self.modalInfo.showDepartmentModal = false;
          self.getDatas('department', 'Department');
        } else {
          SweetAlert.swal({title: "编辑失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showDepartmentModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    };
    // 增加
    function addCategory() {
      var data = {
        'categoryName': self.addCategoryInput
      };
      httpService.formPostRequest(interfacesService.addCategory, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("增加成功", response.data.msg, "success");
          self.modalInfo.showCategoryModal = false;
          self.getDatas('category', 'Category');
        } else {
          SweetAlert.swal({title: "增加失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showCategoryModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    };
    // 编辑
    function updateCategory() {
      var data = {
        'id': self.selectedItem['id'],
        'categoryName': self.selectedItem['categoryName']
      };
      httpService.formPostRequest(interfacesService.updateCategory, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("编辑成功", response.data.msg, "success");
          self.modalInfo.showCategoryModal = false;
          self.getDatas('category', 'Category');
        } else {
          SweetAlert.swal({title: "编辑失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showCategoryModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    };

  }
})();
