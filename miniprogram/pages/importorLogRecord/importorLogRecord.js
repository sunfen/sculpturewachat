//index.js
const app = getApp()
import initCalendar, { jump, setTodoLabels, deleteTodoLabels, getTodoLabels, clearTodoLabels, getSelectedDay } from '/../../pages/calendar/index';

const COLOR_GRAY = "rgb(224, 223, 223)";
const COLOR_RED = "rgb(252, 127, 25)";
const TODO_LABEL_COLOR = "green";

var common = require('/../../pages/common/common.js');

var header = app.globalData.header;

Page({
  data: {
    currentTab: 0,
    COLOR_GRAY :"rgb(224, 223, 223)",
    COLOR_RED : "rgb(252, 127, 25)",
    record:{
      id:'',
      morningHour: 4,
      afternoonHour: 4,
      eveningHour: 0,
      totalHour:'8',
      remark: ''
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
    initCalendar();
    setTimeout(function () {

      initCalendar({
        defaultDay: '', // 初始化后是否默认选中指定日期
        noDefault: false, // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置
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
            if (that.data.records[i].time == date){
              isExit = true;
              var record = that.data.records[i];
              that.setData({ record: that.data.records[i] });
            }
          }
          if(!isExit){

            that.setData({record: {
              id: '',
              morningHour: 4,
              afternoonHour: 4,
              eveningHour: 0,
              totalHour: '8',
              time: date,
              remark: '',
              year: currentSelect.year,
              month: currentSelect.month,
              day: currentSelect.day}
              })
          }
          that.showModal();
        },
      });

    }, app.globalData.timeout);

    if (options.project) {
      var project = JSON.parse(options.project);
      var logRecords = project.logRecords;
      that.setData({ records: logRecords, project: project });
      for (var i in logRecords) {
        var data = logRecords[i];
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
    }

    jump();
  },

  goback() {
    var that = this;
    wx.navigateBack({ delta: 1 })
  },


  /**
   * 
   */
  sure:function(e){
    var that = this;
    wx.setStorage({ key: "project_log_record", data: that.data.records })
    that.goback();
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

    that.setData({ [event.target.dataset.property]: event.target.dataset.hour});

    var totalHours = that.data.record.morningHour + that.data.record.afternoonHour + that.data.record.eveningHour;
    
    that.setData({ ["record.totalHour"]: totalHours});
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

    that.data.records.push(that.data.record);
    that.setData({records: that.data.records});

    var time = that.data.calendar.selectedDay[0];
    setTodoLabels({
      circle: true,
      days: [{
        year: time.year,
        month: time.month,
        day: time.day,
        todoText: that.data.record.totalHour + "h",
        todoLabelColor: TODO_LABEL_COLOR
      }],
    });
    that.hideModal();
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
