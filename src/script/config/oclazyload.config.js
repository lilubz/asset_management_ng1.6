// (function() {
//   'use strict';
//
//   angular.module('app').config(appLazyLoad);
//
//   appLazyLoad.$inject = ['$ocLazyLoadProvider'];
//
//   /* @ngInject */
//   function appLazyLoad($ocLazyLoadProvider) {
//     var data = {
//       debug: true,
//       events: false,
//       modules: [
//         {
//           name: 'validation',
//           files: ['../vendor/angular-validation/dist/angular-validation.min.js']
//         }
//       ]
//     }
//     $ocLazyLoadProvider.config(data);
//   }
// })();

// 'use strict';
//
// angular.module('app').config([
//   '$ocLazyLoadProvider',
//   function($ocLazyLoadProvider) {
//     $ocLazyLoadProvider.config({
//       debug: true,
//       events: false,
//       modules: [
//         {
//           name: 'validation',
//           files: ['../vendor/angular-validation/dist/angular-validation.min.js']
//         }
//       ]
//     });
//   }
// ]);
