// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

Page({
  /** 
   * 页面的初始据 
   */
  data: {
  },

  onShow: function(){
    common.checkLogin();
  },

  
  goback() {
    wx.navigateBack({ delta: 1 })
  },
  
  /**
   * 选择一个
   */
  selectOne: function(e){
    var that = this;
    var principal = e.detail.target.dataset.id;

    wx.setStorage({
      key: 'project_principal',
      data: principal,
    })
    wx.navigateBack({ delta: 1 })
  }


}) 
