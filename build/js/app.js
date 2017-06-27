
(function() {
  'use strict';

  angular.module('app', ['ui.router', "oc.lazyLoad", 'ngAnimate', 'ngCookies', 'validation', 'angularFileUpload', 'oitozero.ngSweetAlert']);
})();

(function() {
  'use strict';

  angular.module('app').component('assetTable', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/asset-table/asset-table.template.html',
      controller: assetTableCtrl,
      bindings: {
        data: '<',
        theadInfo: '<',
        firstAction: '&',
        secondAction: '&',
        thirdAction: '&',
        hasCheckbox: '<',
        isSelectedArray: '<'
      },
      transclude: {
        'checkbox': '?tableCheckbox',
        'button': '?tableButton'
      }
    };

    return component;
  }

  assetTableCtrl.$inject = [];

  /* @ngInject */
  function assetTableCtrl() {}
})();

(function() {
  'use strict';

  angular.module('app').factory('assetTableService', factory);

  factory.$inject = ['$rootScope', '$state', '$http', 'interfacesService'];

  /* @ngInject */
  function factory($rootScope, $state, interfacesService) {
    var service = {
      tableInitailize: tableInitailize
    }

    return service

    // 创建table表头信息，计算每一列的宽度
    function tableInitailize(data) {
      var list = data.list[0];
      var theadInfo = {
        theadEng: [],
        theadChn: [],
        theadStyle: {}
      };
      angular.forEach(list, function(value, key) {
        if (key !== 'createTime' && key !== 'updateTime') {
          var keyChn;
          switch (key) {
            case 'assetId':
              keyChn = '资产编号';
              break;
            case 'assetName':
              keyChn = '资产名称';
              break;
            case 'assetCategory':
              keyChn = '资产类别';
              break;
            case 'brandSpecification':
              keyChn = '品牌规格';
              break;
            case 'unitMeasurement':
              keyChn = '计量单位';
              break;
            case 'bookAmount':
              keyChn = '资产账面数量';
              break;
            case 'inventoryAmount':
              keyChn = '资产盘点数量';
              break;
            case 'storageLocation':
              keyChn = '存放地点';
              break;
            case 'departmentResponsibility':
              keyChn = '责任部门';
              break;
            case 'personInCharge':
              keyChn = '责任人';
              break;
            case 'statusUsage':
              keyChn = '使用状况';
              break;
          }
          theadInfo.theadEng.push(key);
          theadInfo.theadChn.push(keyChn);
        }
      });
      theadInfo.theadStyle = {
        'width': (1 / theadInfo.theadEng.length * 100) + '%'
      };
      return theadInfo;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app').component('assetModal', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/asset-modal/asset-modal.template.html',
      controller: assetModalCtrl,
      bindings: {
        modalTitle: '@',
        btnName: '@',
        isDisable: '<',
        modal: '<',
        showModal: '=',
        clean: '&',
        submit: "&"
      }
    };

    return component;
  }

  assetModalCtrl.$inject = [];

  /* @ngInject */
  function assetModalCtrl() {}
})();

(function() {
  'use strict';

  angular.module('app').component('searchGroup', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/search-group/search-group.template.html',
      controller: searchGroupCtrl,
      bindings: {
        searchType: '<',
        searchInfo: '<',
        lastSearchRecord: '<',
        searchUrl: '<',
        searchAction: "&"
      }
    };

    return component;
  }

  searchGroupCtrl.$inject = ['$timeout', 'interfacesService', 'httpService'];

  /* @ngInject */
  function searchGroupCtrl($timeout, interfacesService, httpService) {
    var self = this;
    var autoSearchResult;
    var lastAutoSearchKeyWord;
    // self.$onInit = function(){
    self.departmentArray = []
    self.categoryArray = []
    self.autoCompleteArray = []
    self.showAutoComplete = false
    // }
    self.$onChanges = function(changes) {
      if (changes.searchType)
        self.searchInfo.searchKeyWord = '';
    };

    self.getDeptAndCateArray = getDeptAndCateArray;
    self.autoSearch = autoSearch;
    self.createAutoCompleteArray = createAutoCompleteArray;
    self.selectAutoCompleteItem = selectAutoCompleteItem;
    self.hide = hide;

    self.getDeptAndCateArray(interfacesService.getDepartment, 'department');
    self.getDeptAndCateArray(interfacesService.getCategory, 'category');

    // 删除两边空格
    function trim(string) {
      return string.replace(/(^\s*)|(\s*$)/g, "");
    }
    // 获取部门和资产类别信息
    function getDeptAndCateArray(url, param) {
      httpService.getRequest(url).then(function(response) {
        if (response.data.status == 0) {
          self[param + 'Array'] = response.data.data;
        }
      })
    }
    // 由keyup触发，发起请求
    function autoSearch() {
      lastAutoSearchKeyWord = '';
      if (self.searchInfo.searchType == "assetId")
        return;
      var keyWord = trim(self.searchInfo.searchKeyWord);
      self.showAutoComplete = true;
      if (!keyWord) {
        self.autoCompleteArray = [];
        return
      }
      if (keyWord && lastAutoSearchKeyWord !== keyWord) {
        lastAutoSearchKeyWord = keyWord;
        httpService.getTableInfoRequest(interfacesService[self.searchUrl], self.searchInfo.searchType, keyWord, '', '', 1, 99).then(function(response) {
          if (response.status == 200 && response.data.data.list) {
            autoSearchResult = response.data.data.list;
            self.createAutoCompleteArray();
          }
        })
      }
    }
    // 由返回数据生成模糊搜索列表
    function createAutoCompleteArray() {
      self.autoCompleteArray = [];
      if (autoSearchResult.length) {
        var key = self.searchInfo.searchType;
        for (var i = 0; i < autoSearchResult.length; i++) {
          if (autoSearchResult[i][key] && self.autoCompleteArray.indexOf(autoSearchResult[i][key]) === -1) {
            self.autoCompleteArray.push(autoSearchResult[i][key])
          }
        }
      }
    }
    // 点击触发搜索
    function selectAutoCompleteItem(item) {
      self.showAutoComplete = false;
      self.autoCompleteArray = [];
      self.searchInfo.searchKeyWord = item;
      self.searchAction({searchType: self.searchInfo.searchType, searchKeyWord: item, assetCategory: '', departmentResponsibility: '', pageNum: 1})
    }
    // 隐藏模糊搜索列表
    function hide() {
      if (self.showAutoComplete === true)
        $timeout(function() {
          self.showAutoComplete = false;
          self.autoCompleteArray = [];
          lastAutoSearchKeyWord = '';
        }, 200)
    }

  }
})();

(function() {
  'use strict';

  angular.module('app').component('pagination', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/pagination/pagination.template.html',
      controller: paginationCtrl,
      bindings: {
        data: '<',
        searchInfo: '<',
        searchPageSize: '<',
        searchPageNumber: '<',
        searchUrl: '<',
        lastSearchRecord: '<',
        searchPageNumberChange: '&',
        searchAction: '&'
      }
    };

    return component;
  }

  paginationCtrl.$inject = [];

  /* @ngInject */
  function paginationCtrl() {
    var self = this;
    self.$onChanges = function(changes) {
      if (changes.searchPageSize && !changes.searchPageSize.isFirstChange()) {
        self.searchAction({
          searchType: self.lastSearchRecord.searchType,
          searchKeyWord: self.lastSearchRecord.searchKeyWord,
          assetCategory: self.lastSearchRecord.assetCategory,
          departmentResponsibility: self.lastSearchRecord.departmentResponsibility,
          pageNum: 1,
          url: self.searchUrl
        });
      }
      if (changes.searchPageNumber && !changes.searchPageNumber.isFirstChange()) {
        self.searchAction({
          searchType: self.lastSearchRecord.searchType,
          searchKeyWord: self.lastSearchRecord.searchKeyWord,
          assetCategory: self.lastSearchRecord.assetCategory,
          departmentResponsibility: self.lastSearchRecord.departmentResponsibility,
          pageNum: self.searchInfo.searchPageNumber,
          url: self.searchUrl
        });
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app').component('selectMenu', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/select-menu/select-menu.template.html',
      controller: selectMenuCtrl,
      bindings: {
        searchInfo: '<',
        inventoryType: '<',
        selectList: '<',
        action: '&'
      }
    };

    return component;
  }

  selectMenuCtrl.$inject = [];

  /* @ngInject */
  function selectMenuCtrl() {
    var self = this
    self.$onChanges = function(changes) {
      if (changes.inventoryType && !changes.inventoryType.isFirstChange()) {
        self.action({
          searchType: '',
          searchKeyWord: '',
          assetCategory: '',
          departmentResponsibility: '',
          pageNum: 1,
          url: self.searchInfo.inventoryType
        });
      }
    }

  }
})();

(function() {
  'use strict';

  angular.module('app').component('warningModal', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'components/warning-modal/warning-modal.template.html',
      controller: warningModalCtrl,
      bindings: {
        modalTitle: '@',
        showModal: '=',
        clean: '&'
      },
      transclude: {
        'div': '?modalDiv',
        'text': '?modalText',
        'reminder': '?modalReminder'
      }
    };

    return component;
  }

  warningModalCtrl.$inject = [];

  /* @ngInject */
  function warningModalCtrl() {}
})();

(function() {
  'use strict';

  angular.module('app').component('appBreadcrumb', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'layout/app-breadcrumb/breadcrumb.template.html',
      controller: appBreadcrumbCtrl
    };

    return component;
  }

  appBreadcrumbCtrl.$inject = ['breadcrumbService', '$scope'];

  /* @ngInject */
  function appBreadcrumbCtrl(breadcrumbService, $scope) {
    var self = this
    self.breadcrumbArr = breadcrumbService.updateBreadcrumbs()
    $scope.$on('$stateChangeSuccess', function() {
      self.breadcrumbArr = breadcrumbService.updateBreadcrumbs()
    })
  }
})();


(function() {
  'use strict';

  angular.module('app').factory('breadcrumbService', factory);

  factory.$inject = ['$rootScope', '$state', '$stateParams', '$interpolate'];

  /* @ngInject */
  function factory($rootScope, $state, $stateParams, $interpolate) {
    var service = {
        updateBreadcrumbs: updateBreadcrumbs,
        generateBreadcrumbs: generateBreadcrumbs,
        breadcrumbParentState: breadcrumbParentState
    }

    return service

    //更新当前的面包屑
    function updateBreadcrumbs() {
      var breadcrumbs = [];
      for (var curState = $state.$current.name; curState; curState = this.breadcrumbParentState(curState)) {
        this.generateBreadcrumbs(breadcrumbs, curState);
      }
      return breadcrumbs = (breadcrumbs.length > 1)
        ? breadcrumbs.reverse()
        : breadcrumbs;
    }

    //生成面包屑
    function generateBreadcrumbs(chain, stateName) {
      var skip = false;
      var displayName,
        breadcrumbLabel;
      //如果当前状态已经存在状态链中，直接返回
      for (var i = 0; i < chain.length; i++) {
        if (chain[i].link === stateName) {
          return;
        }
      }
      var state = $state.get(stateName);
      if (state.breadcrumb && state.breadcrumb.label) {
        breadcrumbLabel = state.breadcrumb.label;
        displayName = $interpolate(breadcrumbLabel)($rootScope);
      } else {
        displayName = state.name;
      }
      if (state.breadcrumb) {
        if (state.breadcrumb.skip) {
          skip = true;
        }
      }
      if (!state.abstract && !skip) {
        if (state.breadcrumb && state.breadcrumb.param) {
          chain.push({
            link: stateName,
            label: $stateParams[state.breadcrumb.param],
            abstract: false
          });
        }
        if (!state.breadcrumb || !state.breadcrumb.param) {
          chain.push({link: stateName, label: displayName, abstract: false});
        }
      }
    }

    //返回当前状态的父状态
    function breadcrumbParentState(stateName) {
      var curState = $state.get(stateName);
      //如果当前状态的abstract属性为true，直接返回
      if (curState.abstract)
        return;
      //如果当前状态配置了面包屑对象，并且配置了parent属性，返回parentStateRef
      if (curState.breadcrumb && curState.breadcrumb.parent) {
        var isFunction = typeof curState.breadcrumb.parent === 'function';
        var parentStateRef = isFunction
          ? curState.breadcrumb.parent($rootScope)
          : curState.breadcrumb.parent;
        if (parentStateRef) {
          return parentStateRef;
        }
      }
      //若不符合前两个条件，则返回isObjectParent
      var parent = curState.parent(/^(.+)\.[^.]+$/.exec(curState.name))[1];
      var isObjectParent = typeof parent === "object";
      return isObjectParent
        ? parent.name
        : parent;
    }

  }
})();


(function() {
  'use strict';

  angular.module('app').component('appSidebar', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'layout/app-sidebar/sidebar.template.html',
      controller: appSidebarCtrl
    };

    return component;
  }

  appSidebarCtrl.$inject = ['$rootScope', '$state', '$scope'];

  /* @ngInject */
  function appSidebarCtrl($rootScope, $state, $scope) {
    var self = this
    self.currentState = $state.$current.name
    $scope.$on('$stateChangeSuccess', function() {
      self.currentState = $state.$current.name
    })
  }
})();

(function() {
  'use strict';

  angular.module('app').component('appHead', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'layout/app-head/head.template.html',
      controller: appHeadCtrl
    };

    return component;
  }

  appHeadCtrl.$inject = [];

  /* @ngInject */
  function appHeadCtrl() {
    this.$onInit = function() {
      this.showLogout = false
    }
  }
})();

(function() {
  'use strict';

  angular.module('app').config(appLazyLoad);

  appLazyLoad.$inject = ['$ocLazyLoadProvider'];

  /* @ngInject */
  function appLazyLoad($ocLazyLoadProvider) {
    var data = {
      debug: true,
      events: false,
      modules: [
        {
          name: 'validation',
          files: ['../vendor/angular-validation/dist/angular-validation.min.js']
        }
      ]
    }
    $ocLazyLoadProvider.config(data);
  }
})();

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

(function() {
  'use strict';

  angular.module('app').config(appRouter);

  appRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

  /* @ngInject */
  function appRouter($stateProvider, $urlRouterProvider) {
    var loginState = {
      url: '/login',
      templateUrl: 'pages/login.html'
    }
    var mainState = {
      abstract: true,
      templateUrl: 'pages/main/main.template.html'
    }
    var assetManagementState = {
      // url: '^/assetManagement',
      template: '<div ui-view></div>',
      breadcrumb: {
        label: "资产管理",
        parent: "main"
      }
    }
    var assetSearch = {
      url: '^/assetSearch',
      template: '<asset-search></asset-search>',
      breadcrumb: {
        label: "资产查询",
        parent: "main.assetManagement"
      }
    }
    var assetRecovery = {
      url: '^/assetRecovery',
      template: '<asset-recovery></asset-recovery>',
      breadcrumb: {
        label: "资产恢复",
        parent: "main.assetManagement"
      }
    }
    var assetsInventory = {
      url: '^/assetsInventory',
      template: '<asset-inventory inventory-type="&quot;getNotCompleteInventory&quot;"></asset-inventory>',
      breadcrumb: {
        label: "资产盘点",
        parent: "main.assetManagement"
      }
    }
    var cdManagement = {
      url: '^/cdManagement',
      template: '<cd-management></cd-management>',
      breadcrumb: {
        label: "类属管理",
        parent: "main"
      }
    }
    var errorState = {
      url: '^/404',
      templateUrl: 'pages/404.html',
      breadcrumb: {
        label: "404",
        parent: "main"
      }
    }
    $stateProvider.state('login', loginState);
    $stateProvider.state('main', mainState);
    $stateProvider.state('main.assetManagement', assetManagementState);
    $stateProvider.state('main.assetManagement.assetSearch', assetSearch);
    $stateProvider.state('main.assetManagement.assetRecovery', assetRecovery);
    $stateProvider.state('main.assetManagement.assetsInventory', assetsInventory);
    $stateProvider.state('main.cdManagement', cdManagement);
    $stateProvider.state('main.404', errorState);
    $urlRouterProvider.otherwise('assetSearch');

  }
})();

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

(function() {
  'use strict';

angular
.module('app')
.directive('a', preventClickDirective)
.directive('a', bootstrapCollapseDirective)
.directive('a', navigationDirective)
.directive('button', layoutToggleDirective)
.directive('a', layoutToggleDirective)
.directive('button', collapseMenuTogglerDirective)
.directive('div', bootstrapCarouselDirective)
.directive('toggle', bootstrapTooltipsPopoversDirective)
.directive('tab', bootstrapTabsDirective)
.directive('button', cardCollapseDirective)

//Prevent click if href="#"
function preventClickDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.href === '#'){
      element.on('click', function(event){
        event.preventDefault();
      });
    }
  }
}

//Bootstrap Collapse
function bootstrapCollapseDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.toggle=='collapse'){
      element.attr('href','javascript;;').attr('data-target',attrs.href.replace('index.html',''));
    }
  }
}

/**
* @desc Genesis main navigation - Siedebar menu
* @example <li class="nav-item nav-dropdown"></li>
*/
function navigationDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if(element.hasClass('nav-dropdown-toggle') && angular.element('body').width() > 782) {
      element.on('click', function(){
        if(!angular.element('body').hasClass('compact-nav')) {
          element.parent().toggleClass('open').find('.open').removeClass('open');
        }
      });
    } else if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() < 783) {
      element.on('click', function(){
        element.parent().toggleClass('open').find('.open').removeClass('open');
      });
    }
  }
}

//Dynamic resize .sidebar-nav
sidebarNavDynamicResizeDirective.$inject = ['$window', '$timeout'];
function sidebarNavDynamicResizeDirective($window, $timeout) {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {

    if (element.hasClass('sidebar-nav') && angular.element('body').hasClass('fixed-nav')) {
      var bodyHeight = angular.element(window).height();
      scope.$watch(function(){
        var headerHeight = angular.element('header').outerHeight();

        if (angular.element('body').hasClass('sidebar-off-canvas')) {
          element.css('height', bodyHeight);
        } else {
          element.css('height', bodyHeight - headerHeight);
        }
      })

      angular.element($window).bind('resize', function(){
        var bodyHeight = angular.element(window).height();
        var headerHeight = angular.element('header').outerHeight();
        var sidebarHeaderHeight = angular.element('.sidebar-header').outerHeight();
        var sidebarFooterHeight = angular.element('.sidebar-footer').outerHeight();

        if (angular.element('body').hasClass('sidebar-off-canvas')) {
          element.css('height', bodyHeight - sidebarHeaderHeight - sidebarFooterHeight);
        } else {
          element.css('height', bodyHeight - headerHeight - sidebarHeaderHeight - sidebarFooterHeight);
        }
      });
    }
  }
}

//LayoutToggle
layoutToggleDirective.$inject = ['$interval'];
function layoutToggleDirective($interval) {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    element.on('click', function(){

      if (element.hasClass('sidebar-toggler')) {
        angular.element('body').toggleClass('sidebar-hidden');
      }

      if (element.hasClass('aside-menu-toggler')) {
        angular.element('body').toggleClass('aside-menu-hidden');
      }
    });
  }
}

//Collapse menu toggler
function collapseMenuTogglerDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    element.on('click', function(){
      if (element.hasClass('navbar-toggler') && !element.hasClass('layout-toggler')) {
        angular.element('body').toggleClass('sidebar-mobile-show')
      }
    })
  }
}

//Bootstrap Carousel
function bootstrapCarouselDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.ride=='carousel'){
      element.find('a').each(function(){
        $(this).attr('data-target',$(this).attr('href').replace('index.html','')).attr('href','javascript;;')
      });
    }
  }
}

//Bootstrap Tooltips & Popovers
function bootstrapTooltipsPopoversDirective() {
  var directive = {
    restrict: 'A',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.toggle=='tooltip'){
      angular.element(element).tooltip();
    }
    if (attrs.toggle=='popover'){
      angular.element(element).popover();
    }
  }
}

//Bootstrap Tabs
function bootstrapTabsDirective() {
  var directive = {
    restrict: 'A',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    element.click(function(e) {
      e.preventDefault();
      angular.element(element).tab('show');
    });
  }
}

//Card Collapse
function cardCollapseDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.toggle=='collapse' && element.parent().hasClass('card-actions')){

      if (element.parent().parent().parent().find('.card-block').hasClass('in')) {
        element.find('i').addClass('r180');
      }

      var id = 'collapse-' + Math.floor((Math.random() * 1000000000) + 1);
      element.attr('data-target','#'+id)
      element.parent().parent().parent().find('.card-block').attr('id',id);

      element.on('click', function(){
        element.find('i').toggleClass('r180');
      })
    }
  }
}
})();

(function() {
  'use strict';

  angular.module('app').factory('httpService', factory);

  factory.$inject = ['$http', '$q'];

  /* @ngInject */
  function factory($http, $q) {
    var service = {
      getRequest: getRequest,
      JSONPostRequest: JSONPostRequest,
      formPostRequest: formPostRequest,
      getTableInfoRequest: getTableInfoRequest
    };

    return service;

    // 重封装get请求
    function getRequest(url, data) {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: url,
        data: {
          params: data
        }
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    // 重封装post请求
    function JSONPostRequest(url, data) {
      var deferred = $q.defer();
      $http.post(url, JSON.stringify(data)).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    // 重封装post请求，参数序列化
    function formPostRequest(url, data) {
      var deferred = $q.defer();
      $http({
        method: "POST",
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charser=UTF-8'
        },
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
          return str.join("&");
        }
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    // 重封装get请求，查询列表信息
    function getTableInfoRequest(url, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, pageSize) {
      var deferred = $q.defer();
      var assetId = '';
      var assetName = '';
      var brandSpecification = '';
      var personInCharge = '';
      switch (searchType) {
        case '':
          break;
        case 'assetId':
          assetId = (searchKeyWord !== '')
            ? searchKeyWord
            : '';
          break;
        case 'assetName':
          assetName = (searchKeyWord !== '')
            ? searchKeyWord
            : '';
          break;
        case 'personInCharge':
          personInCharge = (searchKeyWord !== '')
            ? searchKeyWord
            : '';
          break;
      };
      $http.get(url, {
        params: {
          'assetId': assetId,
          'assetName': assetName,
          'brandSpecification': brandSpecification,
          'personInCharge': personInCharge,
          'assetCategory': assetCategory,
          'departmentResponsibility': departmentResponsibility,
          'pageNum': pageNum,
          'pageSize': pageSize
        }
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

  }
})();

// angular.module('app').factory('httpService', [
//   '$http',
//   '$q',
//   function($http, $q) {
//     return {
//       // 重封装get请求
//       getRequest: function(url, data) {
//         var deferred = $q.defer();
//         $http({
//           method: "GET",
//           url: url,
//           data: {
//             params: data
//           }
//         }).then(function(response) {
//           deferred.resolve(response);
//         }).catch(function(response) {
//           deferred.reject(response);
//         });
//         return deferred.promise;
//       },
//
//       // 重封装post请求，参数序列化
//       postRequest: function(url, data) {
//         var deferred = $q.defer();
//         $http({
//           method: "POST",
//           url: url,
//           data: data,
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded; charser=UTF-8'
//           },
//           transformRequest: function(obj) {
//             var str = [];
//             for (var p in obj) {
//               str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//             }
//             return str.join("&");
//           }
//         }).then(function(response) {
//           deferred.resolve(response);
//         }).catch(function(response) {
//           deferred.reject(response);
//         });
//         return deferred.promise;
//       },
//
//       // 重封装get请求，查询列表信息
//       getTableInfoRequest: function(url, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, pageSize) {
//         var deferred = $q.defer();
//         var assetId = '';
//         var assetName = '';
//         var brandSpecification = '';
//         var personInCharge = '';
//         switch (searchType) {
//           case '':
//             break;
//           case 'assetId':
//             assetId = (searchKeyWord !== '')
//               ? searchKeyWord
//               : '';
//             break;
//           case 'assetName':
//             assetName = (searchKeyWord !== '')
//               ? searchKeyWord
//               : '';
//             break;
//           case 'personInCharge':
//             personInCharge = (searchKeyWord !== '')
//               ? searchKeyWord
//               : '';
//             break;
//         };
//         $http.get(url, {
//           params: {
//             'assetId': assetId,
//             'assetName': assetName,
//             'brandSpecification': brandSpecification,
//             'personInCharge': personInCharge,
//             'assetCategory': assetCategory,
//             'departmentResponsibility': departmentResponsibility,
//             'pageNum': pageNum,
//             'pageSize': pageSize
//           }
//         }).then(function(response) {
//           deferred.resolve(response);
//         }).catch(function(response) {
//           deferred.reject(response);
//         });
//         return deferred.promise;
//       }
//     };
//   }
// ]);


(function() {
  'use strict';

  angular.module('app').factory('interfacesService', factory);

  factory.$inject = [];

  /* @ngInject */
  function factory() {
    var main = "http://192.168.1.56:8080/";
    // var backup = "http://192.168.1.107:28088/";
    var backup = "http://192.168.1.8:18080/";

    var api = backup;
    var interfaces = {
      'searchUrl': api + "asset/getAssetList.do",
      'searchByIdUrl': api + "asset/getAssetById.do",
      'addUrl': api + "asset/addAssetItem.do",
      'updateUrl': api + "asset/updateAssetInfo.do",
      'deleteUrl': api + "asset/deleteItem.do",
      'printQRcode': api + "asset/printQRcode.do",
      'importUrl': api + "asset/importAssetRecord.do",
      'exportUrl': api + "asset/exportStorageRecord.do",
      'getAssetUrl': api + "asset/getAssetSelect.do",

      'clearInventoryAmount': api + "asset/clearInventoryAmount.do",
      'assetsInventory': api + "asset/assetsInventory.do",
      'getCompleteInventory': api + "asset/getCompleteInventory.do",
      'getNotCompleteInventory': api + "asset/getNotCompleteInventory.do",

      'getAssetRecycle': api + "asset/getAssetRecycle.do",
      'deleteAssetRecycleItem': api + "asset/deleteAssetRecycleItem.do",
      'deleteAssetRecycleMultiItem': api + "asset/deleteAssetRecycleMultiItem.do",
      'notExistItemInAssetTable': api + "asset/notExistItemInAssetTable.do",
      'notExistMultiItemInAssetTable': api + "asset/notExistMultiItemInAssetTable.do",
      'recycleAssetItem': api + "asset/recycleAssetItem.do",
      'recycleAssetMultiItem': api + "asset/recycleAssetMultiItem.do",

      'getDepartment': api + "manage/department/getDepartment.do",
      'addDepartment': api + "manage/department/addDepartment.do",
      'updateDepartment': api + "manage/department/updateDepartment.do",
      'deleteDepartment': api + "manage/department/deleteDepartment.do",
      'getCategory': api + "manage/assetCategory/getCategory.do",
      'addCategory': api + "manage/assetCategory/addCategory.do",
      'updateCategory': api + "manage/assetCategory/updateCategory.do",
      'deleteCategory': api + "manage/assetCategory/deleteCategory.do"
    };

    return interfaces;
  }
})();

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

  assetInventoryCtrl.$inject = ['interfacesService', 'httpService', 'assetTableService', 'SweetAlert'];

  /* @ngInject */
  function assetInventoryCtrl(interfacesService, httpService, assetTableService, SweetAlert) {
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
      showModal: false
    };
    self.selectList = [{name: '未盘点', value: 'getNotCompleteInventory'}, {name: '已盘点', value: 'getCompleteInventory'}]

    // function
    self.searchPageNumberChange = searchPageNumberChange
    self.getInventory = getInventory
    self.clearInventoryAmount = clearInventoryAmount
    self.assetInventory = assetInventory

    self.getInventory('', '', '', '', 1, 'getNotCompleteInventory')

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
      httpService.getTableInfoRequest(interfacesService[url], searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, self.searchInfo.searchPageSize).then(function(response) {
        if (response.status == 200 && response.data.data.list) {
          lastSearchRecord.searchType = searchType;
          lastSearchRecord.searchKeyWord = searchKeyWord;
          lastSearchRecord.assetCategory = assetCategory;
          lastSearchRecord.departmentResponsibility = departmentResponsibility;
          self.data = response.data.data;
          if (self.searchInfo.searchPageNumber != response.data.data.pageNum && response.data.data.pageNum)
            self.searchInfo.searchPageNumber = response.data.data.pageNum;
          self.theadInfo = assetTableService.tableInitailize(self.data);
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
      httpService.formPostRequest(interfacesService.clearInventoryAmount).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("清空资产盘点成功", response.data.msg, "success");
          self.modalInfo.showModal = false;
          self.getInventory('', '', '', '', 1, 'getNotCompleteInventory');
          self.searchInfo.inventoryType = 'getNotCompleteInventory';
        } else {
          SweetAlert.swal({title: "清空资产盘点失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showModal = false;
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
      httpService.formPostRequest(interfacesService.assetsInventory, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("盘点资产成功", response.data.msg, "success");
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

(function() {
  'use strict';

  angular.module('app').component('assetRecovery', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/asset-recovery/asset-recovery.template.html',
      controller: assetRecoveryCtrl
    };

    return component;
  }

  assetRecoveryCtrl.$inject = ['interfacesService', 'httpService', 'assetTableService', 'SweetAlert'];

  /* @ngInject */
  function assetRecoveryCtrl(interfacesService, httpService, assetTableService, SweetAlert) {
    var self = this;
    self.data = {};
    self.theadInfo = {};
    self.loading = false;
    self.selectAll = false;
    self.selectedItem = {};
    self.selectedArray = [];
    self.isSelectedArray = [];
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
      showSingleDeleteModal: false,
      showMultipleDeleteModal: false
    };

    // function
    self.searchPageNumberChange = searchPageNumberChange
    self.showSingleDeleteModal = showSingleDeleteModal
    self.showMultipleDeleteModal = showMultipleDeleteModal
    self.selectAllCheckBox = selectAllCheckBox
    self.selectSingleCheckBox = selectSingleCheckBox
    self.getAssetRecycle = getAssetRecycle
    self.notExistItemInAssetTable = notExistItemInAssetTable
    self.recycleAssetItem = recycleAssetItem
    self.deleteAssetRecycleItem = deleteAssetRecycleItem
    self.createDataList = createDataList
    self.notExistMultiItemInAssetTable = notExistMultiItemInAssetTable
    self.recycleAssetMultiItem = recycleAssetMultiItem
    self.deleteAssetRecycleMultiItem = deleteAssetRecycleMultiItem

    self.getAssetRecycle('', '', '', '', 1);

    // 换页
    function searchPageNumberChange(newValue) {
      if (newValue < 1)
        return;
      if (newValue > self.data.pages)
        return;
      self.searchInfo.searchPageNumber = newValue;
    }
    // 显示删除模态框
    function showSingleDeleteModal(item) {
      self.modalInfo.showSingleDeleteModal = true;
      self.selectedItem = item;
    }
    // 显示批量删除模态框
    function showMultipleDeleteModal() {
      self.selectedArray = self.createDataList();
      if (!self.selectedArray.length)
        return;
      self.modalInfo.showMultipleDeleteModal = true;
    }
    // 全选/全不选
    function selectAllCheckBox() {
      var selectAll = self.selectAll;
      // self.isSelectedArray[0] = selectAll;
      angular.forEach(self.isSelectedArray, function(data, index, array) {
        array[index] = selectAll;
      });
    }
    // 选择列表中checkbox时触发
    function selectSingleCheckBox() {
      if (self.selectAll === true)
        self.selectAll = false;
      if (self.selectAll === false) {
        self.selectAll = (self.isSelectedArray.indexOf(false) === -1)
          ? true
          : false;
      }
    }
    // 获取资产回收站列表
    function getAssetRecycle(searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum) {
      var lastSearchRecord = self.lastSearchRecord;
      self.loading = true;
      httpService.getTableInfoRequest(interfacesService.getAssetRecycle, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, self.searchInfo.searchPageSize).then(function(response) {
        if (response.status == 200 && response.data.data.list) {
          lastSearchRecord.searchType = searchType;
          lastSearchRecord.searchKeyWord = searchKeyWord;
          lastSearchRecord.assetCategory = assetCategory;
          lastSearchRecord.departmentResponsibility = departmentResponsibility;
          self.data = response.data.data;
          if (self.searchInfo.searchPageNumber != response.data.data.pageNum && response.data.data.pageNum)
            self.searchInfo.searchPageNumber = response.data.data.pageNum;
          self.theadInfo = assetTableService.tableInitailize(self.data);
          self.selectAll = false;
          self.isSelectedArray = [];
          for (var i = 0; i < self.data.list.length; i++) {
            self.isSelectedArray.push(false);
          };
        } else {
          self.data.list = [];
        }
        self.loading = false;
      }).catch(function(response) {
        self.loading = false;
        SweetAlert.swal({title: "服务器出错了", text: response.statusText, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 查重资产表中是否存在单条资产记录
    function notExistItemInAssetTable(id) {
      var data = {
        assetId: id
      };
      httpService.formPostRequest(interfacesService.notExistItemInAssetTable, data).then(function(response) {
        if (response.data.status == 0) {
          self.recycleAssetItem(data);
        } else {
          SweetAlert.swal({
            title: '如果恢复，则现资产表中相同资产编号的资产将被覆盖',
            text: response.data.msg,
            type: "warning",
            confirmButtonColor: "#F8BB86",
            confirmButtonText: "确定恢复",
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: true
          }, function(isConfirm) {
            if (isConfirm)
              self.recycleAssetItem(data);
            }
          );
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      })
    }
    // 恢复资产回收站中单条记录
    function recycleAssetItem(data) {
      var lastSearchRecord = self.lastSearchRecord;
      httpService.formPostRequest(interfacesService.recycleAssetItem, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("恢复成功", response.data.msg, "success");
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "恢复失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 删除资产回收站单条记录
    function deleteAssetRecycleItem() {
      var lastSearchRecord = self.lastSearchRecord;
      var data = {
        assetId: self.selectedItem['assetId']
      };
      httpService.formPostRequest(interfacesService.deleteAssetRecycleItem, data).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.modalInfo.showSingleDeleteModal = false;
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showSingleDeleteModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 根据已选内容生成assetIdList
    function createDataList() {
      var assetIdList = [];
      var dataList = self.data.list;
      var isSelectedArray = self.isSelectedArray;
      if (isSelectedArray.indexOf(true) == -1) {
        SweetAlert.swal({title: "恢复失败", text: "未选择任何资产记录", type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        return;
      }
      angular.forEach(self.isSelectedArray, function(data, index, array) {
        if (data === true) {
          assetIdList.push(dataList[index].assetId)
        };
      });
      return assetIdList;
    }
    // 查重资产表中是否存在多条资产记录
    function notExistMultiItemInAssetTable() {
      var assetIdList = self.createDataList();
      if (!assetIdList)
        return;
      httpService.JSONPostRequest(interfacesService.notExistMultiItemInAssetTable, assetIdList).then(function(response) {
        if (response.data.status == 0) {
          self.recycleAssetMultiItem(assetIdList);
        } else {
          SweetAlert.swal({
            title: '如果恢复，则下列资产编号的资产信息将被覆盖',
            text: response.data.data,
            type: "warning",
            confirmButtonColor: "#F8BB86",
            confirmButtonText: "确定恢复",
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: true
          }, function(isConfirm) {
            if (isConfirm)
              self.recycleAssetMultiItem(assetIdList);
            }
          );
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 恢复资产回收站中多条记录
    function recycleAssetMultiItem(assetIdList) {
      var lastSearchRecord = self.lastSearchRecord;
      httpService.JSONPostRequest(interfacesService.recycleAssetMultiItem, assetIdList).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("恢复成功", response.data.msg, "success");
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "恢复失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 删除资产回收站多条记录
    function deleteAssetRecycleMultiItem() {
      var lastSearchRecord = self.lastSearchRecord;
      httpService.JSONPostRequest(interfacesService.deleteAssetRecycleMultiItem, self.selectedArray).then(function(response) {
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.modalInfo.showMultipleDeleteModal = false;
          self.getAssetRecycle(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.showMultipleDeleteModal = false;
        }
      }).catch(function(response) {
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
  }
})();

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
    'FileUploader',
    'SweetAlert'
  ];

  /* @ngInject */
  function assetSearchCtrl(interfacesService, httpService, assetTableService, FileUploader, SweetAlert) {
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
      addModal: {
        show: false
      },
      editModal: {
        show: false
      },
      deleteModal: {
        show: false
      },
      importModal: {
        show: false,
        currentStep: 1
      },
      exportModal: {
        show: false
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
    self.showEditModal = showEditModal;
    self.showDeleteModal = showDeleteModal;
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

    // 显示编辑modal
    function showEditModal(item) {
      var modalInfo = self.modalInfo;
      modalInfo.editModal.show = true;
      angular.forEach(modalInfo.modal, function(value, key) {
        modalInfo.modal[key] = item[key];
      });
    }
    // 显示删除modal
    function showDeleteModal(item) {
      self.modalInfo.deleteModal.show = true;
      self.selectedItem = item;
    }
    // 清理modal信息
    function clean() {
      var modalInfo = self.modalInfo;
      angular.forEach(modalInfo.modal, function(value, key) {
        modalInfo.modal[key] = '';
      });
      self.selectedItem = {};
    };
    // 换页
    function searchPageNumberChange(newValue) {
      if (newValue < 1)
        return;
      if (newValue > self.data.pages)
        return;
      self.searchInfo.searchPageNumber = newValue;
    };
    // 查询信息
    function searchItem(searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum) {
      var lastSearchRecord = self.lastSearchRecord;
      self.loading = true;
      httpService.getTableInfoRequest(interfacesService.getAssetUrl, searchType, searchKeyWord, assetCategory, departmentResponsibility, pageNum, self.searchInfo.searchPageSize).then(function(response) {
        if (response.status == 200 && response.data.data.list) {
          console.log('666')
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
      httpService.formPostRequest(interfacesService.addUrl, self.modalInfo.modal).then(function(response) {
        self.clean();
        if (response.data.status == 0) {
          SweetAlert.swal("添加成功", response.data.msg, "success");
          self.modalInfo.addModal.show = false;
          self.searchItem(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, 1);
        } else {
          SweetAlert.swal({title: "添加失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.addModal.show = false;
        }
      }).catch(function(response) {
        self.clean();
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 编辑信息
    function editItem() {
      var lastSearchRecord = self.lastSearchRecord;
      httpService.formPostRequest(interfacesService.updateUrl, self.modalInfo.modal).then(function(response) {
        self.clean();
        if (response.data.status == 0) {
          SweetAlert.swal("编辑成功", response.data.msg, "success");
          self.modalInfo.editModal.show = false;
          self.searchItem(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "编辑失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.editModal.show = false;
        }
      }).catch(function(response) {
        self.clean();
        SweetAlert.swal({title: "服务器出错了", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
      });
    }
    // 删除信息
    function deleteItem() {
      var lastSearchRecord = self.lastSearchRecord;
      var data = {
        'assetId': self.selectedItem['assetId']
      };
      httpService.formPostRequest(interfacesService.deleteUrl, data).then(function(response) {
        self.clean();
        if (response.data.status == 0) {
          SweetAlert.swal("删除成功", response.data.msg, "success");
          self.modalInfo.deleteModal.show = false;
          self.searchItem(lastSearchRecord.searchType, lastSearchRecord.searchKeyWord, lastSearchRecord.assetCategory, lastSearchRecord.departmentResponsibility, self.searchInfo.searchPageNumber);
        } else {
          SweetAlert.swal({title: "删除失败", text: response.data.msg, type: "error", confirmButtonColor: "#F27474", confirmButtonText: "确定"});
          self.modalInfo.deleteModal.show = false;
        }
      }).catch(function(response) {
        self.clean();
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
      self.modalInfo.importModal.show = false;
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
      self.modalInfo.exportModal.show = true;
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

// 'use strict';
// angular.module('app').controller('appCtrl', [
//   '$http',
//   '$scope',
//   function($http, $scope) {}
// ]);
