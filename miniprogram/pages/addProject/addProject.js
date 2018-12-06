// pages/index/addProject.js
const app = getApp()
var date = new Date();
var years = [];
const months = [1,2,3,4,5,6,7,8,9,10,11,12];
var days = [];
const hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

for (let i = 2000; i <= date.getFullYear(); i++) {
  years.push(i);
}


var monthStartDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
var monthEndDate = new Date(date.getFullYear(), date.getMonth() + 2, 1);

for (let i = 1; i <= (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24); i++) {
  days.push(i);
}


Page({
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month: date.getMonth() + 1,
    days: days,
    day: date.getDate(),
    hours: hours,
    hour: "00",
    value: [date.getFullYear(), date.getMonth() + 1, date.getDate(), hours[0]],
  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      hour: this.data.hours[val[3]]
    });

    var monthStartDate = new Date(this.data.year, this.data.month- 1, 1);
    var monthEndDate = new Date(this.data.year, this.data.month, 1);

    var newDays = [];
    for (let i = 1; i <= (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24); i++) {
      newDays.push(i);
    }
    this.setData({ days: newDays });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //取消
  cancel() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  //新增完
  sure() {
    wx.showToast({
      title: '成功添加！',
      icon: 'success',
      success(res){
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 1000) 
      
      }
    })
  },

})