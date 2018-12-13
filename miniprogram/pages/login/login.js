//index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },


  onLoad:function(){
    var that = this;
    wx.getSetting({
      success: function(res){
        if(res.authSetting['scope.userInfo']){
          // 同意授权
          wx.login({
            success: function (res) {
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
                    // 获取到 openId
                    getApp().globalData.openid = openIdRes.data.openid;

                    // 判断openId是否为空
                    if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                      wx.getUserInfo({
                        success: function (res) {
                          //从数据库获取用户信息
                          that.queryUsreInfo();
                        }
                      })
                    } 
                  }
                })
              }
            }
          })
        }
      }
    })
  },


  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: getApp().globalData.urlPath + 'login/wechat/' + getApp().globalData.openid,
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);

        getApp().globalData.userInfo = res.data;
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    });
  },

  //发送验证码
  sendIdentify(event) {
    console.log(event);
  },

  //微信登录授权
  bindGetUserInfo: function (e) {
    wx.navigateTo({
      url: '/pages/loginwechat/loginwechat',
    })
  }

 
})