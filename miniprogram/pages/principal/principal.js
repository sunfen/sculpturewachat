// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js'); 
var time = util.formatTime(new Date());  


Page({
  data: {
    project:{}
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let project = JSON.parse(options.project);
    
    that.setData({ project: project });
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  
  // 关闭详情页
  closeModal: function () {
    this.setData({
      showModalPrincipal: false,
    })
  },
  
  //选择
  select(){
    let project = JSON.stringify(this.data.project);
    wx.navigateTo({
      url: '/pages/book/book?project=' + project,
    })
  },

  //添加负责人
  addPrincipal() {
    this.setData({
      showModalPrincipal: true,
    })
  },




  /**
   * 输入框输入事件
   */
  inputValue:function(e){
    var name = e.target.id;
    this.setData({
      [name]:e.detail.value
    })
    this.updateData();
  },

  updateData(){
    this.setData({
      project: {
        principal: {
          id: this.data.principalId,
          name: this.data.principalName,
        },
        id: this.data.project.id,
        name: this.data.project.name,
        address: this.data.project.address,
        startTime: this.data.project.startTime,
        startHour: this.data.project.startHour,
        dailyWages: this.data.project.dailyWages,
      }
    })
  },


  /**
   * 对话框确认按 负责人
   */
  onConfirm: function (e) {
    var that = this;

    if (that.data.project.principal.name == "" || that.data.project.principal.name == undefined){
      
      common.showAlertToast("请填写项目负责人名称！");
      return;
    }

    that.setData({
      showModalPrincipal: false,
    })

    let project = JSON.stringify(that.data.project);
    
    wx.navigateTo({
      url: '/pages/addProject/addProject?project=' + project,
    })
  },
})