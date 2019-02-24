//index.js
const app = getApp()
import initCalendar, { jump, setTodoLabels, deleteTodoLabels, getTodoLabels, clearTodoLabels, getSelectedDay } from '../../pages/calendar/index';
const COLOR_GRAY = "rgb(224, 223, 223)";
const COLOR_RED = "rgb(252, 127, 25)";

Page({
  data: {
    userInfo: {},
    requestResult: '',
    currentTab: 0,
    currentSelectDate: '',
    currentSelectType:'leave',
    currentRemark: '',
    currentHour: 8,
    currentProject: {id: 1, name: '宋庄分', time: '2018-02-23'},
    currentProjectIndex: 0,
    projects:[
      {id:1, name:'宋庄分', time:'2018-02-23'},
      { id: 2, name: '昌平的', time: '2018-5-23' },
      { id: 3, name: '浮雕啊', time: '2018-12-23' },
      { id: 4, name: '发射点发生', time: '2019-12-23' }
    ],
    selectTypes:[
      { data: 'leave', name: '请假', type:'primary'},
      { data: 'overtime', name: '加班', type: 'default' }
    ],
    hours: [
      { data: 0.5, color: COLOR_GRAY},
      { data: 1, color: COLOR_GRAY },
      { data: 1.5, color: COLOR_GRAY },
      { data: 2, color: COLOR_GRAY},
      { data: 2.5, color: COLOR_GRAY },
      { data: 3, color: COLOR_GRAY },
      { data: 3.5, color: COLOR_GRAY },
      { data: 4.5, color: COLOR_GRAY},
      { data: 5, color: COLOR_GRAY },
      { data: 5.5, color: COLOR_GRAY},
      { data: 6, color: COLOR_GRAY },
      { data: 6.5, color: COLOR_GRAY},
      { data: 7, color: COLOR_GRAY },
      { data: 7.5, color: COLOR_GRAY },
      { data: 8, color: COLOR_RED },
      ]
  },

  
  onLoad() {
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
      whenChangeMonth: (current, next) => { },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      onTapDay(currentSelect, event) {
        that.setData({ currentSelectDate: currentSelect, currentRemark: ''});
        jump(currentSelect.year, currentSelect.month, currentSelect.day);
        that.showModal();
      },


      /**
       * 日历初次渲染完成后触发事件，如设置事件标记
       * @param { object } ctx 当前页面
       */
      afterCalendarRender(ctx) { },

    });
  },
  onShow(){
    jump();
  },


  /**
   * 选择加班时间
   */
  onSelectHours(event){
    var that = this;
    that.changeHours(event.target.dataset.hour);
  },

  changeHours(hourData){
    var that = this;
    for (var i in that.data.hours) {
      if (that.data.hours[i].data == hourData) {
        that.data.hours[i].color = COLOR_RED;
        that.setData({ currentHour: that.data.hours[i].data });
      } else {
        that.data.hours[i].color = COLOR_GRAY;
      }
    }

    this.setData({ hours: that.data.hours });
  },

  /**
   * 选择类型
   */
  onSelectType(event) {
    var that = this;
    for (var i in that.data.selectTypes) {
      if (that.data.selectTypes[i].data == event.target.dataset.selectType) {
        that.data.selectTypes[i].type = "primary";
        if (that.data.selectTypes[i].data == "leave"){
          that.setData({ currentHour: 8 });
        }else{
          that.setData({ currentHour: 1 });
        }
        that.setData({ currentSelectType: that.data.selectTypes[i].data });
        this.changeHours(that.data.currentHour);
      } else {
        that.data.selectTypes[i].type = "default";
      }
    }

    this.setData({ selectTypes: that.data.selectTypes });
  },


  /**
   * 备注
   */
  /**
   * 输入框输入事件
   */
  inputValue: function (e) {
    var name = e.target.id;
    this.setData({
      currentRemark: e.detail.value
    })
  },


  /**
   * 保存
   */
  save(event){
    var that = this;
    
    that.hideModal();
    setTodoLabels({
      // 待办点标记设置
      pos: 'top', // 待办点标记位置 ['top', 'bottom']
      dotColor: 'red', // 待办点标记颜色
      // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
      circle: true, // 待办
      days: [{
        year: that.data.currentSelectDate.year,
        month: that.data.currentSelectDate.month,
        day: that.data.currentSelectDate.day,
        todoText: that.data.currentRemark
      }],
    });
  },

  /**
   * 绑定项目
   */
  bindProjectChange(event){
    var that = this;
    console.log(event);
    that.setData({ currentProjectIndex: event.detail.value});
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