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
    common.checkLogin();
    setTimeout(function () { 
      that.init();
    }, app.globalData.timeout)
  },


  



  /**
   *  关闭项目详情页
   **/
  closeModal: function(){
    this.setData({
      showModal: false
    })
  },



  /**
   * 弹出项目详情页
   */
  viewdetail(){
    this.setData({
      showModal: true
    })
  },



  /**
  * 新增一条日志
  */
  addOrUpdateLog() {
    wx.navigateTo({
      url: '/pages/addLog/addLog',
    })
  },



  /**
   * 记工统计
   */
  viewStatistics: function () {
    wx.navigateTo({
      url: '/pages/statistics/statistics',
    })
  },

  /**
   * 编辑项目详情页
   */
  editProject() {
    wx.navigateTo({
      url: '/pages/addProject/addProject?id=' + this.data.project.id,
    })
  },


  /**
   * 新增项目详情页
   */
  addProject() {
    wx.navigateTo({
      url: '/pages/addProject/addProject',
    })
  },

  /**
   * 新增结算工资
   */
  addWage() {
    wx.navigateTo({
      url: '/pages/addWages/addWages',
    })
  },




  /**
   * 删除项目详情页
   */
  deletedProject() {
    var that = this;
    wx.showModal({
      content: '是否删除?',
      success(res) {
        if (res.confirm) {
          wx.request({
            method:'delete',
            header: header,
            url: getApp().globalData.urlPath + 'project/' + that.data.project.id,
            success(res) {
              if (res.data.code == "200") {
                wx.showToast({
                  title: '成功删除！',
                  icon: 'success',
                  success(res) {
                    that.setData({
                      showModal: false
                    })
                    that.init();
                  }
                })
              } else if (res.data.code == "500") {
                common.showAlertToast("数据错误，请重试！");
              } else {
                common.showAlertToast("数据错误，请重试！");
              }
            }
          })
        }
      }
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

