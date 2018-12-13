const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //用户按了允许授权按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
      wx.login({
        success:function(res){
          if (res.code) {
            //获取openId
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: 'wx39dc7970f2861ede',
                secret: 'b105e5b8e1cf7d321119ace33f89ebd2',
                grant_type: 'authorization_code',
                js_code: res.code
              },
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (openIdRes) {
                // 判断openId是否为空
                if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                  // 获取到 openId
                  getApp().globalData.openid = openIdRes.data.openid;
                  that.insertUser(e);
                }
              }
            })
          }
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权'
      })
    }
  },

  //插入登录的用户的相关信息到数据库
  insertUser:function(e){
    
    wx.request({
      url: getApp().globalData.urlPath + 'login/wechat/insert_user',
      data: {
        openid: getApp().globalData.openid,
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //从数据库获取用户信息
        getApp().globalData.userInfo = res.data;
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }
    });
  }
})