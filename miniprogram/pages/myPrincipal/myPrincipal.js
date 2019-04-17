// pages/index/addProject.js
const app = getApp()
var common = require('/../../pages/common/common.js');
Page({
  /** 
   * 页面的初始据 
   */
  data: {
  },

  onShow:function(){
    common.checkLogin();
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
    wx.redirectTo({
      url: '/pages/user/user',
    })
  },
}) 
