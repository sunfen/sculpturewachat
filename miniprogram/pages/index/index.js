//index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    allProjects: [],
    pageInfo:{size: 10, page:0}
  },
  getpage() {
    var that = this;
    wx.request({
      url: 'http://localhost:8081/allProjects',
      data: {
        size: that.data.pageInfo.size,
        page: that.data.pageInfo.page,
      },
      success(res) {
        console.log(res.data);
        that.setData({
          allProjects: res.data.content,
          pageInfo: {
            size: res.data.size,
            page: res.data.number +1,
            content: res.data.content,
          }
        });
        console.log(that);
        // 数据成功后，停止下拉刷新
        wx.stopPullDownRefresh();
        if (res.data.content.length == 0){
          wx.showToast({
            title: '没有更多数据了！'
          })
        }
      }
    })
  },
  onLoad:function(){
    this.getpage();
  },
  onPullDownRefresh() {
    this.getpage();
  },
  onReachBottom() {
      this.getpage();
  },
  searchScrollLower(){
    this.getpage();
  },

  //跳转新增项目页面
  addProject(){
    wx.navigateTo({
       url: '/pages/addProject/addProject',
     })
  },
  //跳转详情项目页面
  details() {
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  }
})

