//index.js
Page({
  data: {
    imgs: [
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage.jpg',
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage1.jpg',
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage2.jpg',
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage3.jpg',
    ]
  },
  start: function (e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
})