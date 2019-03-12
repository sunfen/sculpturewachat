// pages/index/addProject.js
const app = getApp()

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
    let principal = JSON.stringify(e.detail.target.dataset.id);
    wx.navigateTo({
      url: '/pages/myPrincipalProject/myPrincipalProject?principal=' + principal,
    })
  },
  goback() {
    wx.reLaunch({
      url: '/pages/user/user',
    })
  },
}) 
