const app = getApp();

import * as echarts from '../../ec-canvas/echarts';
var common = require('/../../pages/common/common.js');
var header = app.globalData.header;
var util = require('../../util/util.js'); 

let chart = null;
let chart2 = null;
let chart3 = null;

let now = new Date().getFullYear();

Page({
  onShareAppMessage: function (res) {
    return {
      title: '我的工作总结出炉啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: 
        function initChart(canvas, width, height) {
              chart = echarts.init(canvas, null, {
                width: width,
                height: height
              });
              canvas.setChart(chart);
              return chart;
            }
    },
    ec2: {
      onInit:
        function initChart2(canvas, width, height) {
          chart2 = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          canvas.setChart(chart2);
          return chart2;
        }
    },
    ec3: {
      onInit: function initChart3(canvas, width, height) {
        chart3 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart3);
        return chart3;
      }
    },
    date: now,
    date2: now,
    date3: now,
    results: null,
    results2: null,
    results3: null,
    totalWages: null
  },


  onShow() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.checkLogin();
    setTimeout(function () {
      wx.hideLoading();
      that.getData();
      that.getData2();
      that.getData3();
    }, app.globalData.timeout * 3)
  },

  change(e){
    var that = this;
    if(e && e.detail.value){
      that.setData({ date: e.detail.value, results: null })
      that.getData();
    }
  },

  change2(e){
    var that = this;
    if (e && e.detail.value) {
      that.setData({ date2: e.detail.value, results2: null })
      that.getData2();
    }
  },
    
  change3(e){
    var that = this;
    if (e && e.detail.value) {
      that.setData({ date3: e.detail.value, results3: null, totalWages: null })
      that.getData3();
    }
  },



  /**
   * 获取数据
   */
  getData() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/statistics/1/' + that.data.date,
      success(res) {
        if(res.statusCode == 200){
          that.setData({ results: res.data})
          that.setOption(res.data);
        }
      },
      complete: (res) =>{
        wx.hideLoading();
      }
    })
  },




  /**
   * 获取数据2
   */
  getData2() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/statistics/2/' + that.data.date2,
      success(res) {
        if (res.statusCode == "200") {
          that.setData({ results2: res.data })
          that.setOption2(res.data);
        }
      },
      complete: (res) => {
        wx.hideLoading();
      }
    })
  },




  /**
   * 获取数据2
   */
  getData3() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/statistics/3/' + that.data.date3,
      success(res) {
        if (res.statusCode == "200") {
          that.setData({ totalWages: res.data.total, results3: res.data })
          that.setOption3(res.data);
        }
      },
      complete: (res) => {
        wx.hideLoading();
      }
    })
  },



  setOption(data){
    chart.setOption({
      tooltip: {
        trigger: 'none',
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: data ? data.names : [],
        textStyle: {fontSize : 16}
      },
      grid: {
        containLabel: true,
        top: '10%',
        right: '10%',
        left: '2%',
        bottom: '2%'
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        hoverAnimation: false,
        legendHoverLink: false,
        silent: true,
        labelLine: {
          normal: { show: false }
        },
        data: data ? data.values : []
      }
      ]
    });
  },


  setOption2(data){
    chart2.setOption({
      dataset: {
        source: data ? data.values : []
      },
      color: ['#3398DB'],
      grid: {
        containLabel: true,
        left: '8%',
        right: '14%',
        bottom: '8%'
      },
      xAxis: { name: '天' , nameTextStyle: { fontSize: 16 }},
      yAxis: {
        name: '项目',
        type: 'category',
        data: data ? data.names : [],
        axisLabel: { interval: 0, fontSize:16 },
        nameTextStyle: {fontSize : 16}
      },
      series: [{
        type: 'bar',
        encode: {
          x: 'amount',
          y: '项目'
        },
        label: {
          normal: {
            show: true,
            position: 'right'
          },
          fontSize :16
        },
        barWidth: '20',
      }]
    });
  },


  setOption3(data){
    chart3.setOption({
      tooltip: {
        trigger: 'none',
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: data ? data.names : [],
        textStyle: { fontSize: 16 }
      },
      grid: {
        containLabel: true,
        right: '10%',
        top: '10%',
        left: '2%',
        bottom: '2%'
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        hoverAnimation: false,
        legendHoverLink: false,
        silent: true,
        labelLine: {
          normal: { show: false }
        },
        data: data ? data.values : []
      }
      ]
    });
  }


});
