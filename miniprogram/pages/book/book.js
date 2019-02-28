// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');


Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    isActive: null,
    listMain: [],
    listTitles: [],
    fixedTitle: null,
    toView: 'inToView0',
    oHeight: [],
    scroolHeight: 0
  },

  /**
   * 选择一个
   */
  selectOne: function(e){
    var that = this;
    var principal = e.target.dataset.id;

    that.setData({
      project: {
        principal: principal,
        id: that.data.project.id,
        name: that.data.project.name,
        address: that.data.project.address,
        startTime: that.data.project.startTime,
        startHour: that.data.project.startHour,
        dailyWages: that.data.project.dailyWages,
      }
    })

    let project = JSON.stringify(this.data.project);
    wx.navigateTo({
      url: '/pages/addProject/addProject?project=' + project,
    })
  },


  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    var that = this;
    var _id = e.target.dataset.id;
    for (var i = 0; i < that.data.listMain.length; ++i) {
      if (that.data.listMain[i].id === _id) {
        that.setData({
          isActive: _id,
          toView: 'inToView' + _id
        })
        break
      }
    }
  },
  
  toBottom: function (e) {
    console.log(e)
  },


  // 页面滑动时触发
  onPageScroll: function (e) {
    this.setData({
      scroolHeight: e.detail.scrollTop
    });
    for (let i in this.data.oHeight) {
      if (e.detail.scrollTop < this.data.oHeight[i].height) {
        this.setData({
          isActive: this.data.oHeight[i].key,
          fixedTitle: this.data.oHeight[i].name
        });
        return false;
      }
    }

  },
  // 处理数据格式，及获取分组高度
  getBrands: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.urlPath + 'principal/search',
      header: header,
      success(res) {

        if (res.statusCode == 200) {

          //赋值给列表值
          //赋值给当前高亮的isActive
          that.setData({
            listMain: res.data,
            isActive: res.data[0].id,
            fixedTitle: res.data[0].region
          });

          //计算分组高度,wx.createSelectotQuery()获取节点信息
          var number = 0;
          for (let i = 0; i < that.data.listMain.length; ++i) {
            wx.createSelectorQuery().select('#inToView' + that.data.listMain[i].id).boundingClientRect(function (rect) {
              number = rect.height + number;
              var newArry = [{ 'height': number, 'key': rect.dataset.id, "name": that.data.listMain[i].region }]
              that.setData({
                oHeight: that.data.oHeight.concat(newArry)
              })

            }).exec();
          };

        }
      }
    })
  },



  onLoad: function (options) {
    var that = this;
    let project = JSON.parse(options.project);
    that.setData({ project: project });
    that.getBrands();
  }
}) 
