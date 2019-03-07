//index.js
const app = getApp()
import initCalendar, { jump, setTodoLabels, deleteTodoLabels, getTodoLabels, clearTodoLabels, getSelectedDay } from '../../pages/calendar/index';

const COLOR_GRAY = "rgb(224, 223, 223)";
const COLOR_RED = "rgb(252, 127, 25)";
const TODO_LABEL_COLOR = "green";

var common = require('/../../pages/common/common.js');

var header = app.globalData.header;

Page({
  data: {
    currentTab: 0,
    record:{
      id:'',
      morningHour: 4,
      afternoonHour: 4,
      eveningHour: 0,
      totalHour:'8',
      remark: '',
      project: {},
      projectId: '',
      projectIndex: 0,
    },
    projects:[],
    selectTypes:[
      {
        data: 'morning', name: '上午', property:'record.morningHour',
         hours: [
          { data: "无", color: COLOR_GRAY }, { data: 1, color: COLOR_GRAY },
          { data: 2, color: COLOR_GRAY }, { data: 3, color: COLOR_GRAY },
          { data: 4, color: COLOR_RED }]
      },
      {
        data: 'afternoon', name: '下午', property: 'record.afternoonHour',
        hours: [
          { data: "无", color: COLOR_GRAY },{ data: 1, color: COLOR_GRAY },
          { data: 2, color: COLOR_GRAY },{ data: 3, color: COLOR_GRAY },
          { data: 4, color: COLOR_RED }]
      },
      {
        data: 'evening', name: '晚上', property: 'record.eveningHour',
        hours: [
          { data: "无", color: COLOR_RED },{ data: 1, color: COLOR_GRAY },
          { data: 1.5, color: COLOR_GRAY },{ data: 2, color: COLOR_GRAY },
          { data: 2.5, color: COLOR_GRAY },{ data: 3, color: COLOR_GRAY },
          { data: 3.5, color: COLOR_GRAY },{ data: 4, color: COLOR_GRAY },
          { data: 4.5, color: COLOR_GRAY },{ data: 5, color: COLOR_GRAY },
          { data: 5.5, color: COLOR_GRAY },{ data: 6, color: COLOR_GRAY },
          { data: 6.5, color: COLOR_GRAY },{ data: 7, color: COLOR_GRAY },
          { data: 7.5, color: COLOR_GRAY },{ data: 8, color: COLOR_GRAY }]
       },
    ],
  },

  
  onLoad(options) {
    var that = this;
    initCalendar({
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 注意：若想初始化时不默认选中当天，则将该值配置为除 undefined 以外的其他非值即可，如：空字符串, 0 ,false等。
      */
      defaultDay: '', // 初始化后是否默认选中指定日期
      noDefault: false, // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {console.log(2) },
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
        var datePro = "record.time";
        that.setData({[datePro]: date});
        
        for(var i in that.data.records){
          if (that.data.records[i].time == date){
            that.setData({ record: that.data.records[i] });
          }
        }
        
        that.showModal();
      },


      /**
       * 日历初次渲染完成后触发事件，如设置事件标记
       * @param { object } ctx 当前页面
       */
      afterCalendarRender(ctx) { },

    });
    if (options.log){
      var log = JSON.parse(options.log);
      jump(log.year, log.month, log.day);
    }else{

      jump();
    }
   
    that.getProjects();
    var selectDate = getSelectedDay();
    that.getLogRecord(selectDate[0].year, selectDate[0].month);
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
    
    var project = "record.project";
    var projectId = "record.projectId";
    var projectIndex = "record.projectIndex";
    that.setData({
      [project]: that.data.projects[event.detail.value],
      [projectIndex]: event.detail.value,
      [projectId]: that.data.projects[event.detail.value].id});
  },


  /**
   * 选择时间
   */
  onSelectHours(event) {
    var that = this;
    var property = event.target.dataset.property;
    var type = event.target.dataset.type;
    var hour = event.target.dataset.hour;
    var totalHour = "record.totalHour";

    that.setData({ [property]: hour == '无' ? 0 : hour});
    var morningHour = that.data.record.morningHour == '无' ? 0 : that.data.record.morningHour;
    var afternoonHour = that.data.record.afternoonHour == '无' ? 0 : that.data.record.afternoonHour;
    var eveningHour =  that.data.record.eveningHour == '无' ? 0 : that.data.record.eveningHour;

    var totalHours = morningHour + afternoonHour + eveningHour;
    
    that.setData({ [totalHour]: totalHours});


    for (var j in that.data.selectTypes){
      if (that.data.selectTypes[j].data == type){

        for (var i in that.data.selectTypes[j].hours) {
          if (that.data.selectTypes[j].hours[i].data == hour) {
            that.data.selectTypes[j].hours[i].color = COLOR_RED;
          } else {
            that.data.selectTypes[j].hours[i].color = COLOR_GRAY;
          }
        }
        this.setData({ selectTypes: that.data.selectTypes });
      }
    }

  },





  /**
   * 保存
   */
  save(event){
    var that = this;
    if (that.data.record.time == "" || that.data.record.time == undefined) {
      common.showAlertToast("请选择日期！");
      return;
    }

    if (that.data.record.remark != undefined && that.data.record.remark.length >= 126) {
      common.showAlertToast("备注不可超过126个字符");
      return;
    }
    if (that.data.record.projectId == "" || that.data.record.projectId == undefined) {
      common.showAlertToast("请选择项目！");
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
            icon: 'success',
            success(res) {
              that.setLog();
            }
          })
        } else if (res.data.code == "404") {
          common.loginFail();
        } else if (res.data.code == "500") {
          common.showAlertToast("数据错误，请重试！");
        } else {
          common.showAlertToast("数据错误，请重试！");
        }

      },
      fail: function (res) {
        common.loginFail();
      }
    })

    that.hideModal();
  },
  
  /**
   *  待办点标记设置
   */
  setLog(){
    var that = this;
    setTodoLabels({
      // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
      circle: true, // 待办
      days: [{
        year: that.data.calendar.selectedDay[0].year,
        month: that.data.calendar.selectedDay[0].month,
        day: that.data.calendar.selectedDay[0].day,
        todoText: that.data.record.totalHour + "h",
        todoLabelColor: TODO_LABEL_COLOR
      }],
    });
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
                todoLabelColor: TODO_LABEL_COLOR
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
    var project = "record.project";
    var projectIndex = "record.projectIndex";
    var projectId = "record.projectId";
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + '/project/search/list',
      success(res) {
        if (res.data.length > 0) {
          that.setData({
            projects: res.data,
            [project]: res.data[0],
            [projectIndex]: 0,
            [projectId]: res.data[0].id
          });
        }
      }
    })
  },







  //隐藏对话框
  hideModal: function () {
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
