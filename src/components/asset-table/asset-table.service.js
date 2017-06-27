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
