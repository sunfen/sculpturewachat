// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;
var common = require('/../../pages/common/common.js');
var header = app.globalData.header;
var util = require('../../util/util.js'); 

Page({
  /** 
   * 页面的初始据 
   */
  data: {
    pricipal:{},
    title :'',
    results: [],
    pageInfo: { size: 7, page: 0 },
  },
  onPullDownRefresh() {
    this.getpageByPrincipal();
  },
  onReachBottom() {
    this.getpageByPrincipal();
  },
  searchScrollLower() {
    this.getpageByPrincipal();
  },
  onLoad(options){
    var that = this;
    var principal = JSON.parse(options.principal);
    that.setData({ principal: principal, title : principal.name});
    that.getpageByPrincipal(0);
  },

  /**
 * 获取所有的项目
 */
  getpageByPrincipal(number) {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + 'project/search/principal/' + that.data.principal.id,
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
  }
}) 
