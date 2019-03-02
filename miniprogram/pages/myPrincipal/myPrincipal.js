// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

Page({
  /** 
   * 页面的初始据 
   */
  data: {
  },

  /**
   * 选择一个
   */
  selectOne: function (e) {
    var that = this;
    var principal = e.detail.target.dataset.id;
    var name = "project.principal";
    that.setData({
      [name]: principal
    })

    let project = JSON.stringify(this.data.project);
    wx.navigateTo({
      url: '/pages/addProject/addProject?project=' + project,
    })
  },
}) 
