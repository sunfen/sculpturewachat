//index.js
Page({
  data: {
    imgs: [
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage.png',
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage1.png',
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage2.png',
      'cloud://scuplture-71456f.7363-scuplture-71456f/images/homePage3.png',
    ]
  },
  start: function (e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
})