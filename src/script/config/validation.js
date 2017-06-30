(function() {
  'use strict';

  angular.module('app').config(formValidation);

  formValidation.$inject = ['$validationProvider'];

  /* @ngInject */
  function formValidation($validationProvider) {
    var expression = {
      number: /^\d+$/,
      phone: /^1[\d]{10}$/,
      email: /^([a-z0-9]*[-_.]?[a-z0-9]+)+@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i,
      password: function(value) {
        var str = value + ''
        return str.length > 7;
      },
      required: function(value) {
        return !!value;
      }
    };
    var defaultMsg = {
      number: {
        success: '',
        error: '必须是数字'
      },
      phone: {
        success: '',
        error: '必须是11位手机号'
      },
      email: {
        success: '',
        error: '请输入有效的邮箱地址'
      },
      password: {
        success: '',
        error: '密码长度至少8位'
      },
      required: {
        success: '',
        error: '不能为空'
      }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
  }
})();
