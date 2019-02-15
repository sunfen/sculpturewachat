//index.js
const app = getApp()
import initCalendar from '../../pages/calendar/index';
const conf = {
  onShow() {
    initCalendar(); // 使用默认配置初始化日历
  }
};
Page(conf, {
  data: {
    userInfo: {},
    requestResult: '',
    currentTab: 0,
  },
 



  

})
