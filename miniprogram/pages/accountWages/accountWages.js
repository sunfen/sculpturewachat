// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');


Page({
  data: {
    project:{},
    results:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.project != undefined && options.project != null) {
      let project = JSON.parse(options.project);
      that.setData({ project: project });
      wx.request({
        header: header,
        url: getApp().globalData.urlPath + 'project/' + project.id,
        success(res) {
          if (res.data) {
            that.setData({
              project: res.data
            })
          }
        }
      })
      wx.request({
        header: header,
        url: getApp().globalData.urlPath + 'wagesrecord/search/' + project.id,
        success(res) {
          if (res.data) {
            that.setData({
              results: res.data
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



  touchstart(e) {
    common.touchstart(e, this);
  },


  touchmove(e) {
    common.touchmove(e, this);
  },


  /**
   * 新增
   */
  add(){
    var that = this;
    var project = JSON.stringify(that.data.project);
    wx.navigateTo({
      url: '/pages/addWages/addWages?project=' + project,
    })
  },
 
  /**
   * 编辑
   */
  edit(e){
    var that = this;
    var project = JSON.stringify(that.data.project);
    var record = JSON.stringify(that.data.results[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '/pages/addWages/addWages?record=' + record + "&project=" + project,
    })
  },

  /**
   * 删除
   */
  delete(e){
    var that = this;
    wx.showModal({
      content: '是否删除?',
      success(res) {
        if (res.confirm) {
          wx.request({
            method: 'delete',
            header: header,
            url: getApp().globalData.urlPath + 'wagesrecord/' + that.data.results[e.currentTarget.dataset.index].id,
            success(res) {
              if (res.data.code == "200") {
                wx.showToast({
                  title: '成功删除！',
                  icon: 'success',
                  success(res) {
                    that.data.results.splice(e.currentTarget.dataset.index, 1);
                    that.setData({results : that.data.results})
                  }
                })
              } else if (res.data.code == "404") {
                common.loginFail();
              } else if (res.data.code == "500") {
                common.showAlertToast("数据错误，请重试！");
              } else {
                common.showAlertToast("数据错误，请重试！");
              }
            }
          })
        }
      }
    })

  }
})