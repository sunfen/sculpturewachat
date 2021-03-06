//index.js
const app = getApp()
import initCalendar, { jump, setTodoLabels, deleteTodoLabels, getTodoLabels, clearTodoLabels, getSelectedDay } from '../../pages/calendar/index';

const COLOR_GRAY = "rgb(224, 223, 223)";
const COLOR_RED = "rgb(252, 127, 25)";
const TODO_LABEL_COLOR = "green";
const TODO_LABEL_COLOR_ORIGIN = "orange";

var common = require('/../../pages/common/common.js');

var header = app.globalData.header;

Page({
  data: {
    currentTab: 0,
    COLOR_GRAY :"rgb(224, 223, 223)",
    COLOR_RED : "rgb(252, 127, 25)",
    disable:false,
    record:{
      id:'',
      morningHour: 4,
      afternoonHour: 4,
      eveningHour: 0,
      totalHour:'8',
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
    projects:[],
    records: [],
    selectTypes:[
      {
        data: 'morning', name: '上午', property:'record.morningHour',
         hours: [
           { data: 0, name: "无" }, { data: 1, name: 1 },
           { data: 2, name: 2 }, { data: 3, name: 3 },{ data: 4, name: 4 }]
      },
      {
        data: 'afternoon', name: '下午', property: 'record.afternoonHour',
        hours: [
          { data: 0, name: "无" }, { data: 1, name: 1 },
          { data: 2, name: 2 }, { data: 3, name: 3 },{ data: 4, name: 4 }]
      },
      {
        data: 'evening', name: '晚上', property: 'record.eveningHour',
        hours: [
          { data: 0, name: "无" }, { data: 1, name: 1 },{ data: 1.5, name: 1.5 }, { data: 2, name: 2 },
          { data: 2.5, name: 2.5 }, { data: 3, name: 3 },{ data: 3.5, name: 3.5 }, { data: 4, name: 4 },
          { data: 4.5, name: 4.5 }, { data: 5, name: 5 },{ data: 5.5, name: 5.5 }, { data: 6, name: 6 },
          { data: 6.5, name: 6.5 }, { data: 7, name: 7 },{ data: 7.5, name: 7.5 }, { data: 8, name: 8 }]
       },
    ],
  },

  
  onLoad(options) {
    var that = this;
    common.checkLogin();
    initCalendar()
    setTimeout(function () {
        initCalendar({

          defaultDay: '', // 初始化后是否默认选中指定日期
          noDefault: false, // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置

          /**
           * 当改变月份时触发
           * @param { object } current 当前年月
           * @param { object } next 切换后的年月
           */
          whenChangeMonth: (current, next) => {
            clearTodoLabels();
            that.getLogRecord(next.year, next.month);
          },
          /**
           * 日期点击事件（此事件会完全接管点击事件）
           * @param { object } currentSelect 当前点击的日期
           * @param { object } event 日期点击事件对象
           */
          onTapDay(currentSelect, event) {
            
            jump(currentSelect.year, currentSelect.month, currentSelect.day);
            
            var month = currentSelect.month < 10 ? "0" + currentSelect.month : currentSelect.month;
            var day = currentSelect.day < 10 ? "0" + currentSelect.day : currentSelect.day;
            var date = currentSelect.year + "-" + month + "-" + day;
            
            var isExit = false;

            for(var i in that.data.records){
              if (that.data.records[i].time == date && that.data.records[i].id != ""){
                isExit = true;
                var record = that.data.records[i];
                that.setData({ record: that.data.records[i] });
                that.setData({
                  ["record.morningProjectIndex"]: that.findProjectIndex(record.morningProjectId),
                  ["record.afternoonProjectIndex"]: that.findProjectIndex(record.afternoonProjectId),
                  ["record.eveningProjectIndex"]: that.findProjectIndex(record.eveningProjectId),
                });
              }
            }
            if(!isExit){

              that.setData({
                ["record.id"]: '', ["record.morningHour"]: 4,
                ["record.afternoonHour"]: 4,  ["record.eveningHour"]: 0,
                ["record.totalHour"]: '8', ["record.remark"]: '', ["record.time"]: date})
              
              if (that.data.projects.length > 0){
                that.setData({
                  ["record.morningProjectIndex"]: 0,
                  ["record.morningProject"]: that.data.projects[0],
                  ["record.morningProjectId"]: that.data.projects[0].id,
                  ["record.afternoonProjectIndex"]: 0,
                  ["record.afternoonProject"]: that.data.projects[0],
                  ["record.afternoonProjectId"]: that.data.projects[0].id,
                  ["record.eveningProjectIndex"]: 0,
                  ["record.eveningProject"]: that.data.projects[0],
                  ["record.eveningProjectId"]: that.data.projects[0].id
                });
              }
            }
            that.showModal();
          },
        });
        if (options.log){
          var log = JSON.parse(options.log);
          jump(log.year, log.month, log.day);
        }
    }, app.globalData.timeout)
  },
  
  onShow(){
    var that = this;
    that.getProjects();
    var selectDate = getSelectedDay();
    that.getLogRecord(selectDate[0].year, selectDate[0].month);
  },


  goback() {
    wx.navigateBack({ delta: 1 })
  },

  findProjectIndex(id){
    var that = this;
    if(that.data.projects.length == 0){
      return null;
    }
    for(var i in that.data.projects){
      if (that.data.projects[i].id == id){
        return i;
      }
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
   * 绑定项目
   */
  bindProjectChange(event) {
    var that = this;
    if (that.data.projects.length == 0){
      return;
    }

    that.setData({
      [event.target.dataset.projectIndex]: event.detail.value,
      [event.target.dataset.project]: that.data.projects[event.detail.value],
      [event.target.dataset.projectId]: that.data.projects[event.detail.value].id});
  },


  /**
   * 选择时间
   */
  onSelectHours(event) {
    var that = this;
    common.submitFormId(event.detail.formId);
    that.setData({ [event.target.dataset.property]: event.target.dataset.hour});

    var totalHours = that.data.record.morningHour + that.data.record.afternoonHour + that.data.record.eveningHour;
    
    that.setData({ ["record.totalHour"]: totalHours});
  },





  /**
   * 保存
   */
  save(event){

    var that = this;
    common.submitFormId(event.detail.formId);
    if (that.data.record.time == "" || that.data.record.time == undefined) {
      common.showAlertToast("请选择日期！");
      return;
    }

    if (that.data.record.remark != undefined && that.data.record.remark.length >= 126) {
      common.showAlertToast("备注不可超过126个字符");
      return;
    }
    if(that.data.record.morningProjectId == undefined || that.data.record.morningProjectId == null
       || that.data.record.afternoonProjectId == undefined || that.data.record.afternoonProjectId == null 
       ||  that.data.record.eveningProjectId == undefined || that.data.record.eveningProjectId == null){
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
          that.setData({ disable: false });
          wx.showToast({
            title: '成功添加！',
            icon: 'success',
            success(res) {
              that.getLogRecord(that.data.calendar.selectedDay[0].year, that.data.calendar.selectedDay[0].month);
            }
          })
        } else if (res.data.code == "404") {
          common.loginFail();
          that.setData({ disable: false });
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
   * 新增项目
   */
  addProject() {
    wx.navigateTo({
      url: '/pages/addProject/addProject',
    })
  },







  /**
   * 获取日志
   */
  getLogRecord(year, month){
    var that = this;
    wx.request({
      url: getApp().globalData.urlPath + "logrecord/search/" + year + "/" + month,
      header: header,
      success: function (res) {
        if (res.statusCode == "200") {
          that.setData({records: res.data});
          for(var i in res.data){
            var data = res.data[i];
            setTodoLabels({
              circle: true,
              days: [{
                year: data.year,
                month: data.month,
                day: data.day,
                todoText: data.totalHour + "h",
                todoLabelColor: data.totalHour == 0 ? TODO_LABEL_COLOR_ORIGIN : TODO_LABEL_COLOR 
              }],
            });
          }
        } else if (res.statusCode == "404") {
          common.loginFail();
        } else if (res.statusCode == "500") {
          common.showAlertToast("数据错误，请重试！");
        } else {
          common.showAlertToast("数据错误，请重试！");
        }
      },
      fail: function (res) {
        common.loginFail();
      }
    })
  },




  /**
   * 获取项目
   */
  getProjects(){
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
        }
        that.data.projects.push({id: null, name:"无"});
        that.setData({projects: that.data.projects});
      }
    })
  },






  //隐藏对话框
  hideModal: function (e) {
    if (e) {
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
