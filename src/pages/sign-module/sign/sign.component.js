(function() {
    'use strict';

    angular
        .module('app')
        .component('sign', component());

    /* @ngInject */
    function component() {
        var component = {
            templateUrl: 'pages/sign-module/sign/sign.template.html',
            controller: signCtrl,
        };

        return component;
    }

    signCtrl.$inject = [];

    /* @ngInject */
    function signCtrl() {

    }
})();
