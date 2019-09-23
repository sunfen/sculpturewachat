//index.js
const app = getApp()
var common = require('/../../pages/common/common.js');
var header = app.globalData.header;
var util = require('../../util/util.js'); 

const COLOR_GRAY = "rgb(224, 223, 223)";
const COLOR_RED = "rgb(252, 127, 25)";
const TODO_LABEL_COLOR = "green";

// 在页面中定义激励视频广告
let videoAd = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    results: [],
    project:{},
    showModal: false,
    today: util.formatTime(new Date()),
    startX: 0, //开始坐标
    startY: 0,
    COLOR_GRAY: "rgb(224, 223, 223)",
    COLOR_RED: "rgb(252, 127, 25)",
    disable: false,
    record: {
      id: '',
      morningHour: 4,
      afternoonHour: 4,
      eveningHour: 0,
      totalHour: '8',
      remark: '',
      morningProject: {},
      morningProjectId: '',
      morningProjectIndex: 0,
      afternoonProject: {},
      afternoonProjectId: '',
      afternoonProjectIndex: 0,
      eveningProject: {},
      eveningProjectId: '',
      eveningProjectIndex: 0,
    },
    projects: [],
    selectTypes: [
      {
        data: 'morning', name: '上午', property: 'record.morningHour',
        hours: [
          { data: 0, name: "无" }, { data: 1, name: 1 },
          { data: 2, name: 2 }, { data: 3, name: 3 }, { data: 4, name: 4 }]
      },
      {
        data: 'afternoon', name: '下午', property: 'record.afternoonHour',
        hours: [
          { data: 0, name: "无" }, { data: 1, name: 1 },
          { data: 2, name: 2 }, { data: 3, name: 3 }, { data: 4, name: 4 }]
      },
      {
        data: 'evening', name: '晚上', property: 'record.eveningHour',
        hours: [
          { data: 0, name: "无" }, { data: 1, name: 1 }, { data: 1.5, name: 1.5 }, { data: 2, name: 2 },
          { data: 2.5, name: 2.5 }, { data: 3, name: 3 }, { data: 3.5, name: 3.5 }, { data: 4, name: 4 },
          { data: 4.5, name: 4.5 }, { data: 5, name: 5 }, { data: 5.5, name: 5.5 }, { data: 6, name: 6 },
          { data: 6.5, name: 6.5 }, { data: 7, name: 7 }, { data: 7.5, name: 7.5 }, { data: 8, name: 8 }]
      },
    ],
  },

  onLoad: function () {
    var that = this;
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-f05b16d1d8186f87'
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => { })
    }
  
  },

  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.login();
    //common.checkLogin();
    setTimeout(function () { 
      that.init();
      wx.hideLoading()
    }, app.globalData.timeout * 2)
  },



  /**
  * 打卡记录
  */
  addOrUpdateLog(e) {
    common.submitFormId(e.detail.formId);
      wx.navigateTo({
        url: '/pages/addLog/addLog',
      })
  },


  viewdetail(e){
    common.submitFormId(e.detail.formId);
    var that = this;
    wx.navigateTo({
      url: "/pages/detail/detail?projectId=" + that.data.project.id,
    })
  },

  /**
   * 新增项目详情页
   */
  addProject(e) {
    common.submitFormId(e.detail.formId);
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          wx.navigateTo({
            url: '/pages/addProject/addProject',
          })
        } else {
          common.showAlertToast("需要看完视频才可新增项目哦！");
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/addProject/addProject',
      })
    }

  },


  /**
   * 获取init数据
   */
  init() {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/index',
      success(res) {
        if (res.statusCode == "200") {

            that.setData({
              project: res.data.project,
              monthWages: res.data.monthWages,
              workDays: res.data.workDays,
              extraDays: res.data.extraDays,
              leaveDays: res.data.leaveDays,
            });
        } else if (res.statusCode == "500") {
          common.showAlertToast("数据错误，请重试！");
        } else {
          common.showAlertToast("数据错误，请重试！");
        }
      }
    })
    that.getProjects();
  },


  addLogToday(e) {
    var that = this;
    common.submitFormId(e.detail.formId);

    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          that.showModal();
        } else {
          common.showAlertToast("需要看完视频才可新增项目哦！");
        }
      })
    } else {
      that.showModal();
    }
  },



  /**
   * 输入框输入事件  备注
   */
  inputValue: function (e) {
    var name = e.target.dataset.id;
    this.setData({
      [name]: e.detail.value
    })
  },



  /**
   * 选择时间
   */
  onSelectHours(event) {
    var that = this;
    common.submitFormId(event.detail.formId);
    that.setData({ [event.target.dataset.property]: event.target.dataset.hour });

    var totalHours = that.data.record.morningHour + that.data.record.afternoonHour +    that.data.record.eveningHour;

    that.setData({ ["record.totalHour"]: totalHours });
  },


  /**
   * 绑定项目
   */
  bindProjectChange(event) {
    var that = this;
    if (that.data.projects.length == 0) {
      return;
    }

    that.setData({
      [event.target.dataset.projectIndex]: event.detail.value,
      [event.target.dataset.project]: that.data.projects[event.detail.value],
      [event.target.dataset.projectId]: that.data.projects[event.detail.value].id
    });
  },

  /**
   * 保存
   */
  save(event) {

    var that = this;
    common.submitFormId(event.detail.formId);

    that.setData({ ['record.time']: util.formatTime(new Date())});
    if (that.data.record.remark != undefined && that.data.record.remark.length >= 126) {
      common.showAlertToast("备注不可超过126个字符");
      return;
    }
    if (that.data.record.morningProjectId == undefined || that.data.record.morningProjectId == null
      || that.data.record.afternoonProjectId == undefined || that.data.record.afternoonProjectId == null
      || that.data.record.eveningProjectId == undefined || that.data.record.eveningProjectId == null) {
      common.showAlertToast("请选择工作项目!");
      return;
    }
    if (!that.data.disable) {
      that.setData({ disable: true });
    } else {
      return;
    }
    wx.request({
      url: getApp().globalData.urlPath + 'logrecord',
      method: "POST",
      data: that.data.record,
      header: header,
      success: function (res) {
        if (res.data.code == "200") {
          wx.showToast({
            title: '成功添加！',
            icon: 'success'
          })
        } else if (res.data.code == "404") {
          that.setData({ disable: false });
          common.loginFail();
        } else if (res.data.code == "500") {
          that.setData({ disable: false });
          common.showAlertToast("数据错误，请重试！");
        } else {
          that.setData({ disable: false });
          common.showAlertToast("数据错误，请重试！");
        }

      },
      fail: function (res) {
        that.setData({ disable: false });
        common.loginFail();
      }
    })

    that.hideModal();
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
            projects: res.data,
            ["record.morningProjectIndex"]: 0,
            ["record.morningProject"]: res.data[0],
            ["record.morningProjectId"]: res.data[0].id,
            ["record.afternoonProjectIndex"]: 0,
            ["record.afternoonProject"]: res.data[0],
            ["record.afternoonProjectId"]: res.data[0].id,
            ["record.eveningProjectIndex"]: 0,
            ["record.eveningProject"]: res.data[0],
            ["record.eveningProjectId"]: res.data[0].id
          });
        }else{
          common.showAlertToast("还没有项目，赶紧添加项目吧！");
        }
        that.data.projects.push({ id: null, name: "无" });
        that.setData({ projects: that.data.projects });
      }
    })
  },







  //隐藏对话框
  hideModal: function (e) {
    if(e){
      common.submitFormId(e.detail.formId);
    }
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },


  showModal: function () {
    var that = this;
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }.bind(that), 200)
  }
})

