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
    sysWidth: app.globalData.sysWidth,
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

  bindscrolltolower(){
    this.getpageByProject();
  },
  
  onLoad(options) {
    var that = this;
    common.checkLogin();
    setTimeout(function () {
      that.getpageByProject(0);
    }, app.globalData.timeout)
  },


  goback() {
    wx.redirectTo({
      url: '/pages/user/user',
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
        if (!res.data.content || res.data.content.length == 0) {
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
            totalElements: res.data.totalElements
          }
        });
      }
    })
  },


  touchstart(e) {
    this.setData({ startTime: e.timeStamp });
  },


  touchmove(e) {
    this.setData({ endTime: e.timeStamp });
  },

  handleLongPress(e) {
    var that = this;
    that.setData({ startTime: 0, endTime: 0 });
    wx.showActionSheet({
      itemList: ['查看',  '编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          that.detail(e);
        } else if (res.tapIndex == 1) {
          that.editProject(e);
        } else if (res.tapIndex == 2) {
          that.deletedProject(e);
        }
      }
    })
  },

 

  /**
   * 编辑项目
   */
  editProject: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/addProject/addProject?id=' + that.data.results[e.currentTarget.dataset.index].id
    })
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
   * 删除项目详情页
   */
  deletedProject(e) {
    var that = this;
    var projectId = that.data.results[e.currentTarget.dataset.index].id;

    wx.showModal({
      content: '是否删除?',
      success(res) {
        if (res.confirm) {
          wx.request({
            method: 'delete',
            header: header,
            url: getApp().globalData.urlPath + 'project/' + projectId,
            success(res) {
              if (res.data.code == "200") {
                wx.showToast({
                  title: '成功删除！',
                  icon: 'success',
                  success(res) {
                    that.setData({
                      showModal: false
                    })
                    that.getpageByProject();
                  }
                })
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
}) 
