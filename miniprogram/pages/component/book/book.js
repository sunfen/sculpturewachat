// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('../../common/common.js');

Component({
  properties: {
  },
  data: {
    isActive: null,
    listMain: [],
    listTitles: [],
    fixedTitle: null,
    toView: 'inToView0',
    oHeight: [],
    scroolHeight: 0
  },

  lifetimes: {
    attached() {
      var that = this;
      that.getBrands();
    }
  },
  methods: {
    selectOne(e) {
      this.triggerEvent('selectone', e, {});
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
            for (var i in that.data.listMain) {
              var selector = wx.createSelectorQuery().select('#inToView' + that.data.listMain[i].id);
            
              selector.boundingClientRect(function (rect) {
                if(rect != null){

                  number = rect.height + number;
                  var newArry = [{ 'height': number, 'key': rect.dataset.id, "name": that.data.listMain[i].region }]
                  that.setData({
                    oHeight: that.data.oHeight.concat(newArry)
                  })
                }

              }).exec();
            };

          }
        }
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

  },

})





