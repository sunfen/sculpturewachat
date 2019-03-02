//index.js
const app = getApp()


Page({
  /**
   * 页面的初始数据
   */
  data: {},

  previewImage(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
})

