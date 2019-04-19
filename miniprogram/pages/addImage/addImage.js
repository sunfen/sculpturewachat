// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js');

Page({
  data: {
    sysWidth: app.globalData.sysWidth,
    images:[]
  },
  
 
  goback() {
    wx.navigateBack({ delta: 1 })
  },

  onLoad(options){
    var that = this;
    common.checkLogin();
  },

  //添加项目名称
  addimage(e) {
    var that = this;
    common.submitFormId(e.detail.formId);
    wx.chooseMessageFile({
      count: 10,
      type: 'image',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        that.setData({ images: res.tempFiles})
      }
    })
  },




 
})