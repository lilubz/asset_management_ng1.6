
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
