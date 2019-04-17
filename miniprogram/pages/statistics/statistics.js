//index.js
const app = getApp()

var common = require('/../../pages/common/common.js');
var header = app.globalData.header;
var util = require('../../util/util.js'); 

Page({
  data: {
    currentTab: 0,
    results: [],
    pageInfo: {}
  },
  goback() {
    wx.navigateBack({ delta: 1 })
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.getpage(0);
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      that.getpage(0);
    }
  },


  getpage(number){
    var that = this;
    that.setData({
      results: [],
      pageInfo: {
        size: 7,
        page: 0,
        content: [],
      }
    });
    if (that.data.currentTab == 0){
      that.getpageByProject(number);
    }else{
      that.getpageByPrincipal(number);
    }
  },


  /**
  * 获取所有的项目
  */
  getpageByProject(number) {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + 'project/search',
      data: {
        size: that.data.pageInfo.size,
        page: number ? number : that.data.pageInfo.page,
      },
      success(res) {
        // 数据成功后，停止下拉刷新
        wx.stopPullDownRefresh();
        if (res.data.content.length == 0) {
          return;
        }

        for (var i in res.data.content) {
          that.data.results.push(res.data.content[i]);
        }
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


  /**
  * 获取所有的项目
  */
  getpageByPrincipal(number) {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + 'project/search/principal',
      data: {
        size: that.data.pageInfo.size,
        page: number ? number : that.data.pageInfo.page,
      },
      success(res) {
        // 数据成功后，停止下拉刷新
        wx.stopPullDownRefresh();
        if (res.data.content.length == 0) {
          return;
        }

        for (var i in res.data.content) {
          that.data.results.push(res.data.content[i]);
        }
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
    common.checkLogin();
    setTimeout(function () {
      that.getpage();
    }, app.globalData.timeout)
  },

    
})
