//index.js
const app = getApp()


var common = require('/../../pages/common/common.js');


var header = app.globalData.header;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    //用户个人信息
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    count:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow(){
    var that = this;
    that.init();
  },

  about:function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  myPrincipal(){
    wx.navigateTo({
      url: '/pages/myPrincipal/myPrincipal',
    })
  },

  previewImage(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  switchChange(e){
    var that = this;
    that.setData({ switchChange: e.detail.value})
  },


  /**
   * 获取init数据
   */
  init() {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/my',
      success(res) {
        if (res.data) {
          that.setData({
            count: res.data
          });
        }
      }
    })
  },


  //用户按了允许授权按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              header: header,
              url: getApp().globalData.urlPath + 'login/session/' + res.code,
              method: 'GET',
              header: header,
              success: function (res) {
                //从数据库获取用户信息
                that.setData({ isLogin: true });
                if (res.data.code == "200") {
                  //从数据库获取用户信息
                  getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.t;
                  getApp().globalData.userInfo = e.detail.userInfo;
                  var avatarUrl = 'userInfo.avatarUrl';
                  var nickName = 'userInfo.nickName';
                  that.setData({
                    [avatarUrl]: e.detail.userInfo.avatarUrl,
                    [nickName]: e.detail.userInfo.nickName,
                  })
                } else {
                  common.loginFail();
                }
              },
              fail: function (res) {
                common.loginFail();
              }
            })
          }
        }
      })
    } else {
      common.errorWarn("您点击了拒绝授权");
    }
  },


})

