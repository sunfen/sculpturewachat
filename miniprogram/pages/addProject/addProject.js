// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js'); 
var time = util.formatTime(new Date());  
Page({
  data: {
    hours:["上午", "下午"],
    hourIndex: 0,
    startTime: time,
    project:{
      principal:{id:'', name:'',phone:""},
      name:'',
      address:'',
      startTime: time,
      startHour: '上午',
      dailyWages:'0'
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      if(options.id != undefined && options.id != null){
        wx.request({
          header: header,
          url: getApp().globalData.urlPath + 'project/' + options.id,
          success(res) {
            console.log(res.data);
            if (!res.data.id) {
              common.showAlertToast("该项目不存在！");
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }else{
              that.setData({
                project: {
                  principal: {
                    name: res.data.principal.name,
                    phone: res.data.principal.phone,
                  },
                  name: res.data.name,
                  address: res.data.address,
                  startTime: res.data.startTime,
                  startHour: res.data.startHour,
                  dailyWages: res.data.dailyWages,
                },
                id: res.data.id,
                principalName: res.data.principal.name,
                principalPhone: res.data.principal.phone,
                name: res.data.name,
                address: res.data.address,
                dailyWages: res.data.dailyWages,
                startTime: res.data.startTime
              })
            }
          }
        })
      }
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
      showModalWages: false,
      showModalName: false,
      showModalAddress: false
    })
  },


  //添加负责人
  addPrincipal() {
    this.setData({
      showModalPrincipal: true,
    })
  },

  //添加项目名称
  addName() {
    this.setData({
      showModalName: true
    })
  },


  //添加总工资
  addWages() {
    this.setData({
      showModalWages: true
    })
  },


  //添加地点
  addAddress() {
    this.setData({
      showModalAddress: true
    })
  },

  /**
   * 对话框确认按 负责人
   */
  onConfirm: function (e) {
    this.setData({
      showModalPrincipal: false,
      showModalWages: false,
      showModalName: false,
      showModalAddress: false
    })
  },


  /**
   * 输入框输入事件
   */
  inputValue:function(e){
    var name = e.target.id;
    if(name == "principalName"){
      this.setData({
        principalName:e.detail.value
      })
      this.updateData();
      return;
    }

    if (name == "principalPhone") {
      this.setData({
        principalPhone: e.detail.value
      })
      this.updateData();
      return;
    }

    if (name == "name") {
      this.setData({
        name: e.detail.value
      })
      this.updateData();
      return;
    }

    if (name == "address") {
      this.setData({
        address: e.detail.value
      })
      this.updateData();
      return;
    }


    if (name == "dailyWages") {
      this.setData({
        dailyWages: e.detail.value
      })
      this.updateData();
      return;
    }

    if (name == "startTime"){
      this.setData({
        startTime: e.detail.value
      })
      this.updateData();
      return;
    }

    if (name == "hour") {
      this.setData({
        hourIndex: e.detail.value
      })
      this.updateData();
      return;
    }
    
  },

  updateData(){
    this.setData({
      project: {
        principal: {
          name: this.data.principalName,
          phone: this.data.principalPhone,
        },
        id:this.data.id,
        name: this.data.name,
        address: this.data.address,
        startTime: this.data.startTime,
        startHour: this.data.hours[this.data.hourIndex],
        dailyWages: this.data.dailyWages,
      }
    })
  },

  //新增完
  sure() {
    var that = this;
    if (that.data.project.principal.name == "" || that.data.project.principal.phone == ""
      || that.data.project.principal.name == undefined
      || that.data.project.principal.phone == undefined || isNaN(that.data.project.principal.phone) ){
      common.showAlertToast("请填写项目负责人！");
      return;
    }
    if (that.data.project.name == "" || that.data.project.name == undefined) {
      common.showAlertToast("请填写项目名称！");
      return;
    }
    if (that.data.project.address == "" || that.data.project.address == undefined) {
      common.showAlertToast("请填写项目地点！");
      return;
    }
    if (that.data.project.startTime == "" || that.data.project.startTime == undefined) {
      common.showAlertToast("请填写项目开始日期！");
      return;
    }
    if (that.data.project.startHour == "" || that.data.project.startHour == undefined) {
      common.showAlertToast("请填写项目开始时间！");
      return;
    }
    if (that.data.project.dailyWages == "" || that.data.project.dailyWages == undefined || isNaN(that.data.project.dailyWages)) {
      common.showAlertToast("请填写项目日工资！");
      return;
    }


    wx.request({
      url: getApp().globalData.urlPath + 'project',
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
                  url: '/pages/index/index',
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