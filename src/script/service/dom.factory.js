(function() {
  'use strict';

  angular.module('app').factory('domFactory', factory);

  factory.$inject = [];

  /* @ngInject */
  function factory() {
    var service = {
      modalOpen: modalOpen,
      modalHide: modalHide
    };
    var body = document.getElementsByTagName('body');
    var modalBackdrop = document.getElementsByClassName('modal-backdrop');

    return service;

    function modalOpen() {
      angular.element(body).addClass('modal-open');
      angular.element(modalBackdrop).addClass('in').removeClass('d-n');
    }

    function modalHide() {
      angular.element(body).removeClass('modal-open');
      angular.element(modalBackdrop).addClass('d-n').removeClass('in');
    }
  }
})();
