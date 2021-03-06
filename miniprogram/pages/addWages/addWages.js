// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js'); 
var time = util.formatTime(new Date());  
Page({
  data: {
    methods:["银行卡", "微信", "支付宝"],
    methodIndex: 0,
    projectIndex: 0,
    disable: false,
    record:{
      id:"",
      projectId:'',
      wages:'0',
      createTime:'',
      time: time,
      remark: "",
      method: '银行卡'
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    common.checkLogin();
    setTimeout(function(){

      if (options.project != undefined && options.project != null) {
        let project = JSON.parse(options.project);
        var name = "record.projectId";
        that.setData({
          project: project,
          [name]: project.id
        })
        if (options.record != undefined && options.record != null){
            let record = JSON.parse(options.record);
            that.setData({ record: record })
        }
      }
      if (!that.data.record.projectId || that.data.record.projectId == ""){
        that.getProjects();
      }

    }, app.globalData.timeout)
  },



  /**
   * 获取项目
   */
  getProjects() {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/project/search/simple',
      success(res) {
        if (res.data.length > 0) {
          that.setData({
            projects: res.data, ["record.projectId"]: res.data[0].id
          });
        }
      }
    })
  },

  goback() {
    wx.navigateBack({ delta: 1 })
  },



  //添加工资
  addWages(e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalWages: true
    })
  },


  //添加备注
  addRemark(e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalRemark: true
    })
  },


  /**
   * 对话框确认
   */
  onConfirm: function (e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalWages: false,
      showModalRemark: false
    })
  },


  changeProject: function(e){
    var index = e.detail.value;
    var name = "record.projectId"
    if(index){
      this.setData({
        [name]: this.data.projects[index].id
      })
    }
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
    var name = "record.method";
    this.setData({
      [name]: this.data.methods[this.data.methodIndex]
    })
  },

  //新增完
  sure(e) {
    var that = this;
    common.submitFormId(e.detail.formId);
    if (that.data.record.projectId == "" || that.data.record.projectId == undefined){
      common.showAlertToast("请选择项目！");
      return;
    }
    if (that.data.record.wages == "" || that.data.record.wages == undefined
      || isNaN(that.data.record.wages) || that.data.record.wages <= 0) {
      common.showAlertToast("请填写工资！");
      return;
    }
    if (that.data.record.time == "" || that.data.record.time == undefined) {
      common.showAlertToast("请选择时间！");
      return;
    }
    if (that.data.record.method == "" || that.data.record.method == undefined) {
      common.showAlertToast("请选择工资发放方式！");
      return;
    }
    if (!that.data.disable){
      that.setData({ disable : true})
    }else{
      return;
    }

    wx.request({
      url: getApp().globalData.urlPath + 'wagesrecord',
      method: "POST",
      data: this.data.record,
      header: header,
      success: function (res) {
        if (res.data.code == "200") {
          wx.showToast({
            title: '成功添加！',
            icon: 'success',
            success(res) {
              that.goback();
            }
          })
        } else if (res.data.code == "404") {
          that.setData({ disable: false })
          common.loginFail();
        } else if (res.data.code == "500") {
          that.setData({ disable: false })
          common.showAlertToast("数据错误，请重试！");
        }else {
          that.setData({ disable: false })
          common.showAlertToast("数据错误，请重试！");
        }
      },
      fail: function (res){
        that.setData({ disable: false })
        common.loginFail();
      }
    })
  },
})