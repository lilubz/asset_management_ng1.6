(function() {
  'use strict';

  angular.module('app').component('about', component());

  /* @ngInject */
  function component() {
    var component = {
      templateUrl: 'pages/sign-module/about/about.template.html',
      controller: aboutCtrl
    };

    return component;
  }

  aboutCtrl.$inject = [];

  /* @ngInject */
  function aboutCtrl() {
    var self = this;
    self.mapLoad = mapLoad;
    self.mapInit = mapInit;

    // self.mapLoad();
    self.mapInit();

    //异步调用百度地图api
    function mapLoad() {
      var load = document.createElement("script");
      load.src = "http://api.map.baidu.com/api?v=1.4&callback=mapInit";
      document.body.appendChild(load);
    }
    //初始化地图
    function mapInit() {
      var sContent = "<h5 style='margin:0 0 5px 0;padding:0.2em 0'>华业大厦</h5>" +
      "<img style='float:right;margin:4px' id='imgDemo' src='image/huaye.png' width='139' height='104' title='华业大厦'/>" +
      "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>华业高科技产业园作为杭州高新技术产业开发区的配套园区，是杭州市高新区特色产业园和杭州市、高新区科技企业孵化器...</p>" +
      "</div>";
      var modal = new BMap.InfoWindow(sContent);
      var map = new BMap.Map("map");
      var point = new BMap.Point(120.187274, 30.194372);
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true);
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.OverviewMapControl());
      map.addControl(new BMap.PanoramaControl({
        offset: new BMap.Size(10, 50)
      }));
      map.addControl(new BMap.MapTypeControl());
      map.setCurrentCity("杭州");
      marker.addEventListener("click", function() {
        this.openInfoWindow(modal);
      });

    }
  }
})();
