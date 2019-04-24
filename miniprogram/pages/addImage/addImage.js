// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js');

Page({
  data: {
    sysWidth: app.globalData.sysWidth,
    images:[],
    removeImages:[],
    isView : false
  },
  
 
  goback() {
    wx.navigateBack({ delta: 1 })
  },

  onLoad(options){
    var that = this;
    common.checkLogin();
    if(options.images){
      that.setData({images: JSON.parse(options.images)});
    }
    if (options.isView) {
      that.setData({ isView: JSON.parse(options.isView) });
    }
  },

  onShow(){
    var that = this;
    var images = wx.getStorageSync("images");
    if(images){
      that.setData({images : images});
      wx.removeStorageSync("images");
    }
    var removeImages = wx.getStorageSync("removeImages");
    if (removeImages) {
      that.setData({ removeImages: removeImages });
      wx.removeStorageSync("removeImages");
    }
  },


  touchstart(e) {
    this.setData({ startTime: e.timeStamp });
  },


  touchmove(e) {
    this.setData({ endTime: e.timeStamp });
  },


  clickHandle(e){
    this.setData({ endTime: e.timeStamp }); 
   
    if (this.data.endTime - this.data.startTime < 350) {
      this.previewImage(e);
    } else {
      this.handleLongPress(e);
    }
  
    this.setData({ endTime: 0, startTime: 0 });
  },

  previewImage:  function (e)  {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  handleLongPress(e) {
    var that = this;
    if (that.data.isView) {
      that.previewImage(e);
    } else {
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          if (res.tapIndex == 0) {
            that.remove(e);
          }
        }
      })
    }
  },

  remove(e){
    var that = this;
    var image = that.data.images[e.currentTarget.dataset.index];
    that.data.images.splice(e.currentTarget.dataset.index);
    that.setData({ images: that.data.images});
    if (image.id){
      that.data.removeImages.push(image.id);
      that.setData({ removeImages: that.data.removeImages });
    }
  },

  //添加项目名称
  // tempFilePath可以作为img标签的src属性显示图片
  addimage(e) {
    var that = this;
    common.submitFormId(e.detail.formId);
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({ images: res.tempFiles})
      }, fail(res) {
        console.log(res);
      }
    })
  },

  save:function(e){
    wx.setStorageSync("images", this.data.images);
    wx.setStorageSync("removeImages", this.data.removeImages);
    this.goback();
  }

})