// pages/index/addProject.js
const app = getApp()

var common = require('/../../pages/common/common.js');
var header = app.globalData.header;
var util = require('../../util/util.js'); 
Page({
  /** 
   * 页面的初始据 
   */
  data: {
    results: [],
    pageInfo: { size: 7, page: 0 },
  },
  onPullDownRefresh() {
    this.getpageByProject();
  },
  onReachBottom() {
    this.getpageByProject();
  },
  searchScrollLower() {
    this.getpageByProject();
  },
  onLoad(options) {
    var that = this;
    that.getpageByProject(0);
  },

  /**
   * 
   * 查看项目
   */
  detail: function (e) {
    var that = this;
    var project = JSON.stringify(that.data.results[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: "/pages/detail/detail?project=" + project,
    })
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
          common.errorWarn("没有更多数据了！");
          return;
        }
        console.log(res.data);
        for (var i in res.data.content) {
          that.data.results.push(res.data.content[i]);
        }
        that.setData({
          results: that.data.results,
          pageInfo: {
            size: res.data.size,
            page: res.data.number + 1,
            content: res.data.content,
            totalElements: res.data.totalElements
          }
        });
      }
    })
  },
}) 
