(function() {
  'use strict';

  angular.module('app').directive('stopPropagation', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {
      el.bind('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
      });
    }
  }
})();
