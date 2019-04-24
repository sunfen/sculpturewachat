//index.js
const app = getApp()
var common = require('/../../pages/common/common.js');
var header = app.globalData.header;
var util = require('../../util/util.js'); 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    results: [],
    project:{},
    showModal: false,
    today: util.formatTime(new Date()),
    startX: 0, //开始坐标
    startY: 0
  },

  onLoad: function () {
    var that = this;
    common.login();
  },


  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.checkLogin();
    setTimeout(function () { 
      that.init();
      wx.hideLoading()
    }, app.globalData.timeout * 2)
  },


  





  /**
  * 新增一条日志
  */
  addOrUpdateLog(e) {
    common.submitFormId(e.detail.formId);
    wx.navigateTo({
      url: '/pages/addLog/addLog',
    })
  },



  /**
   * 记工统计
   */
  viewStatistics: function (e) {
    common.submitFormId(e.detail.formId);
    wx.navigateTo({
      url: '/pages/statistics/statistics',
    })
  },



  viewdetail(e){
    common.submitFormId(e.detail.formId);
    var that = this;
    wx.navigateTo({
      url: "/pages/detail/detail?projectId=" + that.data.project.id,
    })
  },

  /**
   * 新增项目详情页
   */
  addProject(e) {
    common.submitFormId(e.detail.formId);
    wx.navigateTo({
      url: '/pages/addProject/addProject',
    })
  },

  /**
   * 新增结算工资
   */
  addWage(e) {
    common.submitFormId(e.detail.formId);
    wx.navigateTo({
      url: '/pages/addWages/addWages',
    })
  },

  /**
   * 获取init数据
   */
  init() {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/index',
      success(res) {
        if (res.statusCode == "200") {

            that.setData({
              project: res.data.project,
              monthWages: res.data.monthWages,
              workDays: res.data.workDays,
              extraDays: res.data.extraDays,
              leaveDays: res.data.leaveDays,
            });
        } else if (res.statusCode == "500") {
          common.showAlertToast("数据错误，请重试！");
        } else {
          common.showAlertToast("数据错误，请重试！");
        }
      }
    })
  }
})

