//index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad:function(){
    
  },
  onPullDownRefresh() {
  },
  onReachBottom() {
   
  },
  searchScrollLower(){
    
  },

  //跳转新增项目页面
  loginWechat(){
    console.log(event);
  },

  //跳转新增项目页面
  sendIdentify(event) {
    console.log(event);
  }
}),

  wx.getUserInfo({
    success: function (res) {
      var userInfo = res.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender //性别 0：未知、1：男、2：女
      var province = userInfo.province
      var city = userInfo.city
      var country = userInfo.country
      console.log(res)
    }
  })
