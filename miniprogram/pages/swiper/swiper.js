//index.js
Page({
  data: {
    imgs: [
      '/images/homePage.jpg',
      '/images/homePage1.jpg',
      '/images/homePage2.jpg',
      '/images/homePage3.jpg',
    ]
  },
  start: function (e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
})