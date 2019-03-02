//index.js
const app = getApp()
var common = require('/../../pages/common/common.js');
var header = app.globalData.header;
var util = require('../../util/util.js'); 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    results: [],
    project:{},
    pageInfo:{size: 7, page:0},
    showModal: false,
    today: util.formatTime(new Date()),
    startX: 0, //开始坐标
    startY: 0
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
    //获取openId
    wx.login({
      success: function (res) {
        if (res.code) {
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
                  //从数据库获取用户信息
                  that.setData({isLogin: true});
                  that.login();
              }
            }
          })
        }
      }
    })
  },
  /**
   *  关闭项目详情页
   **/
  closeModal: function(){
    this.setData({
      showModal: false
    })
  },
  /**
   * 弹出项目详情页
   */
  viewdetail(){
    this.setData({
      showModal: true
    })
  },

  /**
 * 新增一条日志
 */
  addOrUpdateLog() {
    wx.navigateTo({
      url: '/pages/addLog/addLog',
    })
  },



  /**
   * 记工统计
   */
  viewStatistics: function () {
    wx.navigateTo({
      url: '/pages/statistics/statistics',
    })
  },

  /**
   * 编辑项目详情页
   */
  editProject() {
    wx.navigateTo({
      url: '/pages/addProject/addProject?id=' + this.data.project.id,
    })
  },


  /**
   * 新增项目详情页
   */
  addProject() {
    wx.navigateTo({
      url: '/pages/addProject/addProject',
    })
  },





  /**
   * 删除项目详情页
   */
  deletedProject() {
    var that = this;
    wx.showModal({
      content: '是否删除?',
      success(res) {
        if (res.confirm) {
          wx.request({
            method:'delete',
            header: header,
            url: getApp().globalData.urlPath + 'project/' + that.data.project.id,
            success(res) {
              if (res.data.code == "200") {
                wx.showToast({
                  title: '成功删除！',
                  icon: 'success',
                  success(res) {
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '/pages/index/index',
                      })
                    }, 1000)
                  }
                })
              } else if (res.data.code == "404") {
                common.loginFail();
              } else if (res.data.code == "500") {
                common.showAlertToast("数据错误，请重试！");
              } else {
                common.showAlertToast("数据错误，请重试！");
              }
            }
          })
        }
      }
    })
  },


  /**
   * 获取init数据
   */
  init() {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/index',
      success(res) {
        if (res.data.pageInfo){
          res.data.pageInfo.content.sort(function (a, b) {
            return a.time < b.time ? 1 : -1; // 这里改为大于号
          });

          that.setData({
            results: res.data.pageInfo.content,
            project: res.data.project,
            monthWages: res.data.monthWages,
            workDays: res.data.workDays,
            pageInfo: {
              size: res.data.pageInfo.size,
              page: res.data.pageInfo.number + 2,
              content: res.data.pageInfo.content,
            }
          });
        }

      }
    })
  },

  /**
   * 获取近一个月的日志
   */
  getpage(number) {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + 'logrecord/search',
      data: {
        size: that.data.pageInfo.size,
        page: that.data.pageInfo.page ,
      },
      success(res) {
        // 数据成功后，停止下拉刷新
        wx.stopPullDownRefresh();
        if (res.data.content.length == 0) {
          common.errorWarn("没有更多数据了！");
          return;
        }
        
        for (var i in res.data.content){
          that.data.results.push(res.data.content[i]);
        }
        that.data.results.sort(function (a, b) {
          return a.time < b.time ? 1 : -1; // 这里改为大于号
        });
        that.setData({
          results: that.data.results,
          pageInfo: {
            size: res.data.size,
            page: res.data.number + 1,
            content: res.data.content,
          }
        });       
      }
    })
  },


  touchstart(e) {
    common.touchstart(e, this);
  },


  touchmove(e) {
    common.touchmove(e, this);
  },


  /**
   * 编辑日志
   */
  editLog: function (e) {
    var that = this;
    console.log("index" + e.currentTarget.dataset.index);
    var log = JSON.stringify(that.data.results[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '/pages/addLog/addLog?log=' + log,
    })
  },



  /**
   * 登录
   */
  login: function (e) {
    var that = this;
    wx.request({
      url: getApp().globalData.urlPath + 'login',
      data: {
        openid: getApp().globalData.openid,
        password: getApp().globalData.openid
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == "200") {
          //从数据库获取用户信息
          getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.t;
          that.setData({ isLogin: true });
          that.init();
        } else {
          common.loginFail();
        }
      },
      fail: function (res) {
        common.loginFail();
      }
    });
  }

})

