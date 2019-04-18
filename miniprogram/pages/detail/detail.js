//index.js
const app = getApp()
import initCalendar, { jump, setTodoLabels, deleteTodoLabels, getTodoLabels, clearTodoLabels, getSelectedDay } from '../../pages/calendar/index';

const TODO_LABEL_COLOR = "green";

var common = require('/../../pages/common/common.js');

var header = app.globalData.header;

Page({
  data: {
    title:"于心",
    project:{}
  },
  goback() {
    wx.navigateBack({ delta: 1 })
  },

  onLoad(options){
    var that = this;
    common.checkLogin();
    initCalendar();
    setTimeout(function () {
      if (options.project){

        var project = JSON.parse(options.project);
      } else if (options.projectId){
        wx.request({
          url: getApp().globalData.urlPath + "project/summary/" + options.projectId,
          header: header,
          success: function (res) {
            if (res.statusCode == "200") {
              that.setData({ project: res.data, title: res.data.name });
              
              initCalendar({
                defaultDay: '', // 初始化后是否默认选中指定日期
                noDefault: false, // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置
                afterTapDay: (currentSelect, allSelectedDays) => { },
          
                whenChangeMonth: (current, next) => {
                  clearTodoLabels();
                  that.getLogRecord(next.year, next.month);
                },
              
                onTapDay(currentSelect, event) {

                  jump(currentSelect.year, currentSelect.month, currentSelect.day);

                  var month = currentSelect.month < 10 ? "0" + currentSelect.month : currentSelect.month;
                  var day = currentSelect.day < 10 ? "0" + currentSelect.day : currentSelect.day;
                  var date = currentSelect.year + "-" + month + "-" + day;

                  for (var i in that.data.records) {
                    if (that.data.records[i].time == date) {
                      var record = that.data.records[i];
                      that.setData({ record: that.data.records[i] });
                    }
                  }
                  that.showModal();
                },
              });
      
                jump();
                var selectDate = getSelectedDay();
                that.getLogRecord(selectDate[0].year, selectDate[0].month);
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
      }
    }, app.globalData.timeout)
  },


  /**
   * 工资
   */
  wagesDetail(){
    var that = this;
    var project = JSON.stringify(that.data.project);

    wx.navigateTo({
      url: '/pages/accountWages/accountWages?project=' + project,
    })
  },



  /**
    * 获取日志
    */
  getLogRecord(year, month) {
    var that = this;
    wx.request({
      url: getApp().globalData.urlPath + "logrecord/search/" + that.data.project.id + "/" + year + "/" + month,
      header: header,
      success: function (res) {
        if (res.statusCode == "200") {
          that.setData({ records: res.data });
          for (var i in res.data) {
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

  //隐藏对话框
  hideModal: function () {
    var that = this;
    that.setData({ record:  {}});
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(that), 200)
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
