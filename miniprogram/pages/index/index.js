//index.js
const app = getApp()


var common = require('/../../pages/common/common.js');


var header = app.globalData.header;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    results: [],
    pageInfo:{size: 10, page:0},
    howModal: false,
    showalert: false
  },
  getpage() {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + 'project/search',
      data: {
        size: that.data.pageInfo.size,
        page: that.data.pageInfo.page,
      },
      success(res) {
        that.setData({
          results: res.data.content,
          pageInfo: {
            size: res.data.size,
            page: res.data.number +1,
            content: res.data.content,
          }
        });
        // 数据成功后，停止下拉刷新
        wx.stopPullDownRefresh();
        if (res.data.content.length == 0){
          common.errorWarn("没有更多数据了！");
        }
      }
    })
  },
  onPullDownRefresh() {
    this.getpage();
  },
  onReachBottom() {
    this.getpage();
  },
  searchScrollLower() {
    this.getpage();
  },
  
  onShow: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
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
                  header: header,
                  success: function (openIdRes) {
                    // 获取到 openId
                    getApp().globalData.openid = openIdRes.data.openid;
                    // 判断openId是否为空
                    if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                      wx.getUserInfo({
                        success: function (res) {
                          //从数据库获取用户信息
                          that.setData({isLogin: true});
                          getApp().globalData.userInfo = res.data;
                          that.getpage();
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


  go: function () {

    this.setData({

      showModal: false

    })

  },
  // 弹出项目详情页
  viewdetail(){
    this.setData({
      showModal: true
    })
  },
  alert: function () {

    var that = this;

    this.setData({

      showalert: !that.data.showalert

    })

  },
  //跳转新增项目页面
  addProject() {
    wx.navigateTo({
      url: '/pages/addProject/addProject',
    })
  },
  //跳转详情项目页面
  details() {
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },

  //用户按了允许授权按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
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
              header: header,
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
      common.errorWarn("您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!");
    }
  },

  //插入登录的用户的相关信息到数据库
  insertUser: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.urlPath + 'login',
      data: {
        username: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        openid: getApp().globalData.openid,
        password: getApp().globalData.openid
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == "200") {
          //从数据库获取用户信息
          getApp().globalData.userInfo = e.detail.userInfo;
          console.log(res.data.t);
          getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.t;
          that.setData({isLogin: true});
          that.getpage();
        } else {
          that.loginFail();
        }
      },
      fail: function (res) {
        that.loginFail();
      }
    });
  },

  loginFail: function () {
    common.errorWarn("未能成功登录, 请重新登录");
  }
})

