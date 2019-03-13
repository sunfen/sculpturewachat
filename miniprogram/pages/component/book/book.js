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
    scroolHeight: 0,
    showModal: false
  },

  lifetimes: {
    attached() {
      var that = this;
      that.getBrands();
    }
  },
  methods: {
    selectOne(e) {
      if (this.data.endTime - this.data.startTime < 350) {
        this.triggerEvent('selectone', e, {});
        this.setData({ startTime: 0, endTime: 0 });
      }
    },

    handleTouchStart: function (e) {
      this.setData({ startTime: e.timeStamp });
    },

    //手指离开
    handleTouchEnd: function (e) {
      this.setData({endTime :e.timeStamp});
    },


    handleLongPress(e){
      var that = this;
      that.setData({ startTime: 0, endTime: 0 });
      wx.showActionSheet({
        itemList:['编辑', '删除'],
        success(res) {
          if (res.tapIndex == 0){
            that.edit(e.target.dataset.id);
          }else
          if (res.tapIndex == 1) {
            that.delete(e.target.dataset.id);
          }
        }
      })
    },

    /**
     * 编辑
     */
    edit(item) {
      var that = this;
      that.setData({ showModal: true, principal: item});
    },
  
    /**
     * 新增
     */
    add(){
      var that = this;
      that.setData({ showModal: true, principal: {} });
    },

  /**
    * 弹出框蒙层截断touchmove事件
    */
    preventTouchMove: function () {
    },


    // 关闭详情页
    closeModal: function () {
      this.setData({
        showModal: false
      })
    },

    /**
     * 输入框输入事件
     */
    inputValue: function (e) {
      var name = e.target.id;
      this.setData({
        [name]: e.detail.value
      })
    },


    //新增完
    /**
     * 对话框确认
     */
    onConfirm: function (e) {
      var that = this;
   
      if (that.data.principal.name == "" || that.data.principal.name == undefined) {
        common.showAlertToast("请填写负责人名称！");
        return;
      }

      that.setData({
        showModal: false
      })

      wx.request({
        url: getApp().globalData.urlPath + 'principal',
        method: "POST",
        data: this.data.principal,
        header: header,
        success: function (res) {
          if (res.data.code == "200") {
            wx.showToast({
              title: '编辑成功！',
              icon: 'success',
              success(res) {
                that.getBrands();
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
    },

    /**
     * 删除
     */
    delete(item) {
      var that = this;
      wx.showModal({
        content: '是否删除?',
        success(res) {
          if (res.confirm) {
            wx.request({
              method: 'delete',
              header: header,
              url: getApp().globalData.urlPath + 'principal/' + item.id,
              success(res) {
                if (res.data.code == "200") {
                  wx.showToast({
                    title: '成功删除！',
                    icon: 'success',
                    success(res) {
                      that.getBrands();
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
              fixedTitle: ""
            });

            //计算分组高度,wx.createSelectotQuery()获取节点信息
            var number = 0;
            for (var i in that.data.listMain) {
              if (that.data.fixedTitle == ""){
                if (that.data.listMain[i].principals.length > 0){
                  that.setData({
                    fixedTitle: that.data.listMain[i].region
                  });
                }
              }
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





