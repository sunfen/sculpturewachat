// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js');

Page({
  data: {
    methods: ["银行卡", "微信", "支付宝"],
    methodIndex: 0,
    disable: false,
    images: [],
    project:{
      id:"",
      principal:{id:'', name:'',phone:""},
      name:'',
      address:'',
      method: '银行卡',
      dailyWages:0,
      actualTotalWages:0,
      logRecords:[],
      images: [],
    }
  },
  goback() {
    wx.reLaunch({
      url: '/pages/user/user',
    })
  },


  onShow(){
    var that = this;
    common.checkLogin();
    setTimeout(function () {
      var mapLocation = wx.getStorageSync('map_location');
      wx.removeStorageSync("map_location");
      if (mapLocation){
        that.setData({ address: mapLocation.address, ["project.address"]: mapLocation.address, location: mapLocation })
      }
    }, app.globalData.timeout)

    var projectPrincipal = wx.getStorageSync('project_principal');
    wx.removeStorageSync("project_principal");
    if (projectPrincipal) {
      that.setData({ ['project.principal']: projectPrincipal })
    }

    var projectLogRecord = wx.getStorageSync('project_log_record');
    wx.removeStorageSync("project_log_record");
    if (projectLogRecord) {
      that.setData({ ['project.logRecords']: projectLogRecord })
        that.data.project.logRecords.sort(function (a, b) {
          return a.time < b.time ? 1 : -1; // 这里改为大于号
        });
    }

    var images = wx.getStorageSync('images');
    wx.removeStorageSync("images");
    if (images) {
      that.setData({ ['project.images']: images });
      that.setData({ images : images });
    }
  },

  
  // 关闭详情页
  hideModal: function () {
    this.setData({
      showModalWages: false,
      showModalName: false,
      showModalActualTotalWages: false
    })
  },


  //添加负责人
  addPrincipal(e) {
    common.submitFormId(e.detail.formId);
    wx.navigateTo({
      url: "/pages/book/book",
    })
  },



  //添加打卡
  addLogRecords(e) {
    common.submitFormId(e.detail.formId);
    let project = JSON.stringify(this.data.project);
    wx.navigateTo({
      url: '/pages/importorLogRecord/importorLogRecord?project=' + project,
    })

  },


  //添加项目名称
  addName(e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalName: true
    })
  },


  //添加日工资
  addWages(e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalWages: true
    })
  },

  //添加已结工资
  addActualTotalWages(e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalActualTotalWages: true
    })
  },


  //添加地点
  addAddress(e) {
    common.submitFormId(e.detail.formId);
    this.moveToLocation();
  },

  //移动选点
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        wx.setStorage({
          key: 'map_location',
          data: res,
        })
      }
    });
  },

  addImages(e) {
    common.submitFormId(e.detail.formId);
    wx.setStorageSync("images", this.data.images);
    wx.navigateTo({
      url: "/pages/addImage/addImage",
    })
  },


  /**
   * 对话框确认
   */
  onConfirm: function (e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalWages: false,
      showModalName: false,
      showModalActualTotalWages:false
    })
  },

  updateData(e) {
    this.setData({
      [e.target.id]: this.data.methods[e.detail.value]
    })
  },

  /**
   * 输入框输入事件
   */
  inputValue:function(e){
    var name = e.target.id;
    this.setData({
      [name]:e.detail.value
    })
  },

  //新增完
  sure(e) {
    var that = this;
    common.submitFormId(e.detail.formId);
    if (that.data.project.principal.name == "" || that.data.project.principal.name == undefined){
      common.showAlertToast("请填写项目负责人名称！");
      return;
    }
    if (that.data.project.name == "" || that.data.project.name == undefined) {
      common.showAlertToast("请填写项目名称！");
      return;
    }
    if (that.data.project.address == "" || that.data.project.address == undefined) {
      common.showAlertToast("请填写地点！");
      return;
    }
    if (that.data.project.dailyWages == "" || that.data.project.dailyWages == undefined 
        || isNaN(that.data.project.dailyWages) || that.data.project.dailyWages <= 0) {
      common.showAlertToast("请正确填写日工资！");
      return;
    } else if ( that.data.project.dailyWages >= 10000) {
      common.showAlertToast("项目日工资须小于一万元！");
      return;
    }

    if (isNaN(that.data.project.actualTotalWages) || that.data.project.actualTotalWages < 0) {
      common.showAlertToast("请正确填写项目已结工资！");
      return;
    }

    if (that.data.project.logRecords == undefined || that.data.project.logRecords == null 
      || that.data.project.logRecords.length == 0) {
      common.showAlertToast("请选择工作时间！");
      return;
    }

    if(!that.data.disable){
      that.setData({disable: true});
    }else{
      return;
    }

    wx.showLoading({
      title: '保存中'
    })
    wx.request({
      url: getApp().globalData.urlPath + 'project/import',
      method: "POST",
      data: this.data.project,
      header: header,
      success: function (res) {
        if (res.data.code == "200") {
          if (that.data.images.length == 0) {
            wx.hideLoading();
            wx.showToast({
              title: '成功添加！',
              icon: 'success',
              success(res) {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/user/user',
                  })
                }, 1000)
              }
            })
          } else {

            that.setData({ i: 0, fail: 0, success: 0 })
            that.uploadimg(res.data.t);
          }

        } else if (res.data.code == "404") {
          that.setData({ disable: false });
          common.loginFail();
        } else if (res.data.code == "500") {
          that.setData({ disable: false });
          common.showAlertToast("数据错误，请重试！");
        }else {
          that.setData({ disable: false });
          common.showAlertToast("数据错误，请重试！");
        }

      },
      fail: function (res){
        that.setData({ disable: false });
        common.loginFail();
      }
    })
  },


  uploadimg(objectId) {
    var that = this;
    for (var i = 0; i < that.data.images.length; i++) {
      var image = that.data.images[i];

      if (image.id) {
        that.data.i += 1;
        that.setData({ i: that.data.i });

      } else {
        wx.uploadFile({
          header: header,
          url: getApp().globalData.urlPath + 'document',
          filePath: image.path,
          name: 'file',
          formData: { objectId: objectId },
          success: (resp) => {
            that.data.i += 1;
            that.data.success += 1;
            that.setData({ success: that.data.success, i: that.data.i });
            console.log(that.data);
          },
          fail: (res) => {
            that.data.i += 1;
            that.data.fail += 1;
            that.setData({ fail: that.data.fail, i: that.data.i });
            console.log(that.data);
          },
          complete: (res) => {
            setTimeout(function () {
              that.alert(objectId);
            }, 400);
          }
        });
      }
    }
  },

  alert(objectId) {
    var that = this;
    if (that.data.i == that.data.images.length) {
      wx.hideLoading();
      wx.showToast({
        title: '成功上传：' + that.data.success + " 张，失败：" + that.data.fail + " 张",
        icon: 'success',
        success(res) {
          wx.redirectTo({
            url: '/pages/user/user',
          })
        }
      })
    }
  }
})