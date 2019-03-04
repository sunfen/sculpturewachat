//app.js
App({
  onLaunch: function () {
    var that = this;
    that.globalData = {
      //urlPath: "http://39.106.157.46:8080/",
      urlPath:"https://www.art-sculpture.cn/",
      //urlPath: "http://localhost:8081/",
      //urlPath: "http://192.168.1.105:8081/",
      openid:'',
      userInfo: {},
      isLogin: false,
      header: { 'Cookie': '' } 
    }
    
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.platform = res.platform
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      },
      failure() {
        that.globalData.statusBarHeight = 0
        that.globalData.titleBarHeight = 0
      }
    })
   
  },

})
