//index.js
const app = getApp()

Page({
  data: {
    title:"于心",
    txt: "正在匹配中..."
  },

  onReady: function () {
    // 获得circle组件
    this.circle = this.selectComponent("#circle");
    // 绘制背景圆环
    this.circle.drawCircleBg('circle_bg',100, 18)
    // 绘制彩色圆环 
    this.circle.drawCircle('circle_draw', 100, 18, 2);
  },

  //统计
  statistics() {
    wx.navigateTo({
      url: '/pages/statistics/statistics',
    })
  },

  //日历
  calendar() {
    wx.navigateTo({
      url: '/pages/calendar/calendar',
    })
  },


  

})
