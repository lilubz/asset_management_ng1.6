(function() {
  'use strict';

  angular.module('app').config(formValidation);

  formValidation.$inject = ['$validationProvider'];

  /* @ngInject */
  function formValidation($validationProvider) {
    var expression = {
      number: /^\d+$/,
      required: function(value) {
        return !!value;
      }
    };
    var defaultMsg = {
      number: {
        success: '',
        error: '必须是数字'
      },
      required: {
        success: '',
        error: '不能为空'
      }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
  }
})();
