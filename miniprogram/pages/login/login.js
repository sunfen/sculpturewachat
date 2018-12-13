//index.js
const app = getApp()
const phone_test = /^1\d{10}$/;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    identify:'',
    identify_disabled: true,
    currentTime: 61,
    time: '获取验证码',
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

  input_phone:function(e){
    var that = this;
    if (phone_test.test(e.detail.value)){
      that.setData({ identify_disabled: false });
    }
    that.setData({phone : e.detail.value});

  },


  input_identify: function (e) {
    var that = this;
    that.setData({ identify: e.detail.value });
  },

  //发送验证码
  sendIdentify(phone) {
    var that = this;
    
    var currentTime = that.data.currentTime;
    
    that.setData({ identify_disabled: true });

    wx.request({
      url: getApp().globalData.urlPath + 'login/sendidentify/' + that.data.phone,
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000,
        })
      }
    });

    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval);
        that.setData({
          time: '重新发送',
          identify_disabled: false
        })
      }
    }, 100)
  },

  //手机号和验证码登录
  login:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.urlPath + 'login/phone',
      data: {
        phone: that.data.phone,
        identify: that.data.identify
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
  

  //微信登录授权
  bindGetUserInfo: function (e) {
    wx.navigateTo({
      url: '/pages/loginwechat/loginwechat',
    })
  }
 
})