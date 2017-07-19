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

  cdManagementCtrl.$inject = ['interfacesFactory', 'httpFactory', 'domFactory', 'SweetAlert'];

  /* @ngInject */
  function cdManagementCtrl(interfacesFactory, httpFactory, domFactory, SweetAlert) {
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
    self.hideModal = hideModal
    self.getDatas = getDatas
    self.deleteDatas = deleteDatas
    self.addDepartment = addDepartment
    self.updateDepartment = updateDepartment
    self.addCategory = addCategory
    self.updateCategory = updateCategory

    self.getDatas('department', 'Department')
    self.getDatas('category', 'Category')

    // 显示模态框
    function showModal(name, item) {
      self.modalInfo[name] = true;
      domFactory.modalOpen();
      self.selectedItem = item;
    };
    // 隐藏模态框
    function hideModal(name) {
      self.modalInfo[name] = false;
      domFactory.modalHide();
    }
    // 获取
    function getDatas(param, Param) {
      self[param + 'Loading'] = true;
      httpFactory.getRequest(interfacesFactory['get' + Param]).then(function(response) {
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
      httpFactory.formPostRequest(interfacesFactory['delete' + Param], data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.hideModal('show' + Param + 'Modal');
          self.getDatas(param, Param);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.hideModal('show' + Param + 'Modal');
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
      httpFactory.formPostRequest(interfacesFactory.addDepartment, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("增加成功", response.data.msg, "success");
          self.getDatas('department', 'Department');
        } else {
          SweetAlert.swal({title: "增加失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
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
      httpFactory.formPostRequest(interfacesFactory.updateDepartment, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("编辑成功", response.data.msg, "success");
          self.hideModal('showDepartmentModal');
          self.getDatas('department', 'Department');
        } else {
          SweetAlert.swal({title: "编辑失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
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
      httpFactory.formPostRequest(interfacesFactory.addCategory, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("增加成功", response.data.msg, "success");
          self.getDatas('category', 'Category');
        } else {
          SweetAlert.swal({title: "增加失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
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
      httpFactory.formPostRequest(interfacesFactory.updateCategory, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("编辑成功", response.data.msg, "success");
          self.hideModal('showCategoryModal');
          self.getDatas('category', 'Category');
        } else {
          SweetAlert.swal({title: "编辑失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    };

  }
})();
