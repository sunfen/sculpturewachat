// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js');

Page({
  data: {
    methods: ["银行卡", "微信", "支付宝"],
    methodIndex: 0,
    project:{
      id:"",
      principal:{id:'', name:'',phone:""},
      name:'',
      address:'',
      method: '银行卡',
      dailyWages:0,
      actualTotalWages:0,
      logRecords:[],
    }
  },
  goback() {
    wx.reLaunch({
      url: '/pages/user/user',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  onShow(){
    var that = this;
    wx.getStorage({
      key: 'map_location',
      success: function (res) {
        wx.removeStorage({
          key: 'map_location'
        })
        that.setData({ address: res.data.address, ["project.address"]: res.data.address, location: res.data })
      }
    })

    wx.getStorage({
      key: 'project_principal',
      success: function (res) {
        wx.removeStorage({
          key: 'project_principal'
        })
        that.setData({ ['project.principal']: res.data })
      }
    })
    wx.getStorage({
      key: 'project_log_record',
      success: function (res) {
        wx.removeStorage({
          key: 'project_logRecords'
        })
        that.setData({ ['project.logRecords']: res.data })
        that.data.project.logRecords.sort(function (a, b) {
          return a.time < b.time ? 1 : -1; // 这里改为大于号
        });
      }
    })
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
      showModalWages: false,
      showModalName: false,
      showModalActualTotalWages: false
    })
  },


  //添加负责人
  addPrincipal() {
    wx.navigateTo({
      url: "/pages/book/book",
    })
  },



  //添加打卡
  addLogRecords() {
    let project = JSON.stringify(this.data.project);
    wx.navigateTo({
      url: '/pages/importorLogRecord/importorLogRecord?project=' + project,
    })

  },


  //添加项目名称
  addName() {
    this.setData({
      showModalName: true
    })
  },


  //添加日工资
  addWages() {
    this.setData({
      showModalWages: true
    })
  },

  //添加已结工资
  addActualTotalWages() {
    this.setData({
      showModalActualTotalWages: true
    })
  },


  //添加地点
  addAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  /**
   * 对话框确认
   */
  onConfirm: function (e) {
    this.setData({
      showModalWages: false,
      showModalName: false,
      showModalActualTotalWages:false
    })
  },

  updateData(e) {
    this.setData({
      [e.target.id]: this.data.methods[e.detail.value]
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
  },

  //新增完
  sure() {
    var that = this;
    if (that.data.project.principal.name == "" || that.data.project.principal.name == undefined){
      common.showAlertToast("请填写项目负责人名称！");
      return;
    }
    if (that.data.project.name == "" || that.data.project.name == undefined) {
      common.showAlertToast("请填写项目名称！");
      return;
    }
    if (that.data.project.address == "" || that.data.project.address == undefined) {
      common.showAlertToast("请填写地点！");
      return;
    }
    if (that.data.project.dailyWages == "" || that.data.project.dailyWages == undefined 
        || isNaN(that.data.project.dailyWages) || that.data.project.dailyWages <= 0) {
      common.showAlertToast("请正确填写日工资！");
      return;
    } else if ( that.data.project.dailyWages >= 10000) {
      common.showAlertToast("项目日工资须小于一万元！");
      return;
    }

    if (isNaN(that.data.project.actualTotalWages) || that.data.project.actualTotalWages < 0) {
      common.showAlertToast("请正确填写项目已结工资！");
      return;
    }

    if (that.data.project.logRecords == undefined || that.data.project.logRecords == null 
      || that.data.project.logRecords.length == 0) {
      common.showAlertToast("请选择工作时间！");
      return;
    }



    wx.request({
      url: getApp().globalData.urlPath + 'project/import',
      method: "POST",
      data: this.data.project,
      header: header,
      success: function (res) {
        if (res.data.code == "200") {
          wx.showToast({
            title: '成功添加！',
            icon: 'success',
            success(res) {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/user/user',
                })
              }, 1000)
            }
          })
        } else if (res.data.code == "404") {
          common.loginFail();
        } else if (res.data.code == "500") {
          common.showAlertToast("数据错误，请重试！");
        }else {
          common.showAlertToast("数据错误，请重试！");
        }

      },
      fail: function (res){
        common.loginFail();
      }
    })
  },
})