// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

Page({
  /** 
   * 页面的初始据 
   */
  data: {
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
    var name = "project.principal";
    that.setData({
      [name]: principal
    })

    let project = JSON.stringify(that.data.project);
    wx.navigateTo({
      url: that.data.url + '?project=' + project,
    })
  },

  onLoad(options){
    
    var that = this;

    that.setData({ project: JSON.parse(options.project), url: options.url});
  }
}) 
