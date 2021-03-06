//app.js
App({
  onLaunch: function () {
    var that = this;
    wx.clearStorageSync();
    that.globalData = {
      //urlPath: "http://39.106.157.46:8080/",
     urlPath:"https://sf-qrcode.cn/",
      //urlPath: "http://localhost:8081/",
      //urlPath: "http://192.168.1.105:8081/",
      openid:'',
      userInfo: {},
      isLogin: false,
      header: { 'Cookie': '' },
      timeout: 800,
      sysWidth: wx.getSystemInfoSync().windowWidth,
    }

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
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
    }),
    wx.showShareMenu({
      withShareTicket: true
    })


    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  },
 
})
