// searchMapLocation.js
const app = getApp()

var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');

var common = require('/../../../pages/common/common.js');

var header = app.globalData.header;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips:[],
    istext: false,
    searchKey: ''
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideKeyboard();
  },

  goback() {
    wx.navigateBack({ delta: 1 })
  },


  clickSearchView: function () {
    this.setData({
      istext: true,
    });
  },

  bindKeyInput: function (e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  clickSearch: function (e) {
    var that = this;
    var keywords = that.data.searchKey;
    if (keywords ==""){
      wx.showModal({
        title: '请输入搜索内容',
        confirmColor: '#e75858',
        showCancel: false,
      })
      return;
    }
    var qqmapsdk = new QQMapWX({
      key: 'GV7BZ-RWP3W-Y52RR-RPYDN-6FWLZ-QXFQT'
    });

    qqmapsdk.getSuggestion({
      keyword: keywords,
  
      complete: function (res) {
        that.setData({
          tips: res.data
        });
        if (that.data.tips == []){
          wx.showModal({
            title: '没有找到您想要的结果',
            confirmColor: "#E75858",
            showCancel: false,
          })
        }

      }
    })
  },

  didSelectCell: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var locationData = this.data.tips[index];

    wx.setStorage({
      key: 'map_location',
      data: locationData,
    })
    wx.navigateBack({
      delta: 1
    })
  }
   
})