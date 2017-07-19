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

  searchGroupCtrl.$inject = ['$timeout', 'interfacesFactory', 'httpFactory'];

  /* @ngInject */
  function searchGroupCtrl($timeout, interfacesFactory, httpFactory) {
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

    self.getDeptAndCateArray(interfacesFactory.getDepartment, 'department');
    self.getDeptAndCateArray(interfacesFactory.getCategory, 'category');

    // 删除两边空格
    function trim(string) {
      return string.replace(/(^\s*)|(\s*$)/g, "");
    }
    // 获取部门和资产类别信息
    function getDeptAndCateArray(url, param) {
      httpFactory.getRequest(url).then(function(response) {
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
        httpFactory.getTableInfoRequest(interfacesFactory[self.searchUrl], self.searchInfo.searchType, keyWord, '', '', 1, 99).then(function(response) {
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
