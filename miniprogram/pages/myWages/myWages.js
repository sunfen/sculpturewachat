//index.js
const app = getApp()

var common = require('/../../pages/common/common.js');

var header = app.globalData.header;
var util = require('../../util/util.js');
 

Page({
  data: {
    sysWidth: app.globalData.sysWidth,
    date: new Date().getFullYear(),
    totalWages: 0,
    totalExpectTotalWages: 0,
    results:[]
  },

  onShow(){
    var that = this;
    common.checkLogin();
    setTimeout(function () {
      
      that.getWages();
    }, app.globalData.timeout)
  },
  goback() {
    wx.redirectTo({
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
          var totalExpectTotalWages = 0;
          for (var i in res.data.results) {
            var record = res.data.results[i];
            totalExpectTotalWages += record.expectTotalWages ? record.expectTotalWages : 0;
              
          }
          that.setData({ results: res.data.results, totalWages: res.data.totalWages, totalExpectTotalWages: totalExpectTotalWages });

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
