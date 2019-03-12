//index.js
const app = getApp()

var common = require('/../../pages/common/common.js');

var header = app.globalData.header;
var util = require('../../util/util.js');
 

Page({
  data: {
    date: new Date().getFullYear(),
    totalWages: 0,
    results:[]
  },

  onLoad(){
    var that = this;
    that.getWages();
  },
  goback() {
    wx.reLaunch({
      url: '/pages/user/user',
    })
  },


  /**
    * 获取工资
    */
  getWages(e) {
    var that = this;
    if(e && e.detail.value){
      that.setData({ date: e.detail.value})
    }

    wx.request({
      url: getApp().globalData.urlPath + "project/search/" + that.data.date,
      header: header,
      success: function (res) {
        if (res.statusCode == "200") {
          that.setData({ results: res.data.results, totalWages: res.data.totalWages });

        } else if (res.statusCode == "404") {
          common.loginFail();
        } else if (res.statusCode == "500") {
          common.showAlertToast("数据错误，请重试！");
        } else {
          common.showAlertToast("数据错误，请重试！");
        }
      },
      fail: function (res) {
        common.loginFail();
      }
    })
  },

})
