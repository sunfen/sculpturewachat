// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js');

Page({
  data: {
    images:[],
    project:{
      id:"",
      principal:{id:'', name:'',phone:""},
      name:'',
      address:'',
      dailyWages:'0'
    }
  },
  
 
  goback() {
    wx.navigateBack({ delta: 1 })
  },

  onLoad(options){
    var that = this;
    common.checkLogin();
    setTimeout(function () {
      
      var mapLocation = wx.getStorageSync( 'map_location');
      var projectPrincipal = wx.getStorageSync('project_principal');
      var images = wx.getStorageSync('images');
      if (mapLocation){
        that.setData({ address: mapLocation.address, ["project.address"]: mapLocation.address, location: mapLocation})
        wx.removeStorageSync('map_location');
      }

      if (images) {
        that.setData({ images: images })
        wx.removeStorageSync('images');
      }
      
      if (projectPrincipal){
        that.setData({ ['project.principal']: projectPrincipal})
        wx.removeStorageSync('project_principal');
      }
      

      if (options.id != undefined && options.id != null) {
        wx.request({
          header: header,
          url: getApp().globalData.urlPath + 'project/' + options.id,
          success(res) {
            if (!res.data.id) {
              common.showAlertToast("该项目不存在！");
              wx.redirectTo({
                url: '/pages/index/index',
              })
            } else {
              that.setData({
                project: res.data,
                id: res.data.id,
                name: res.data.name,
                address: res.data.address,
                dailyWages: res.data.dailyWages,
              })
            }
          }
        })
      } else if (options.project != undefined && options.project != null) {
        let project = JSON.parse(options.project);
        that.setData({
          project: project,
          id: project.id,
          name: project.name,
          address: project.address,
          dailyWages: project.dailyWages,
        });
      }

    }, app.globalData.timeout)
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },


  addImages(e){
    common.submitFormId(e.detail.formId);
    wx.setStorageSync("images", this.data.images);
    wx.navigateTo({
      url: "/pages/addImage/addImage",
    })
  },

  
  // 关闭详情页
  closeModal: function (e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalWages: false,
      showModalName: false,
      showModalAddress: false
    })
  },


  //添加负责人
  addPrincipal(e) {
    common.submitFormId(e.detail.formId);
    wx.navigateTo({
      url: "/pages/book/book",
    })
  },

  //添加项目名称
  addName(e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalName: true
    })
  },


  //添加总工资
  addWages(e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalWages: true
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


  /**
   * 对话框确认
   */
  onConfirm: function (e) {
    common.submitFormId(e.detail.formId);
    this.setData({
      showModalWages: false,
      showModalName: false,
      showModalAddress: false
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
    this.updateData();
  },

  updateData(){
    this.setData({
      project: {
        principal: this.data.project.principal,
        id:this.data.id,
        name: this.data.name,
        address: this.data.address,
        dailyWages: this.data.dailyWages,
      }
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
      common.showAlertToast("请填写项目地点！");
      return;
    }
    if (that.data.project.dailyWages == "" || that.data.project.dailyWages == undefined 
        || isNaN(that.data.project.dailyWages) || that.data.project.dailyWages <= 0) {
      common.showAlertToast("请填写项目日工资！");
      return;
    } else if ( that.data.project.dailyWages >= 10000) {
      common.showAlertToast("项目日工资须小于一万元！");
      return;
    }

    wx.request({
      url: getApp().globalData.urlPath + 'project',
      method: "POST",
      data: this.data.project,
      header: header,
      success: function (res) {
        if (res.data.code == "200") {
          wx.showToast({
            title: '成功添加！',
            icon: 'success',
            success(res) {
              for (var i = 0; i < that.data.images.length; i++){
                var filepath = this.data.images[i].path;
                var sub = filepath.subString(filepath.length -4 , filepath.length);
                var timestamp = Date.parse(new Date());
                var cloudPath = "/images/" + res.data.id +"/"+ timestamp + sub;
                wx.cloud.uploadFile({
                  cloudPath: cloudPath, filePath: filepath,
                  success: res => {
                    console.log(res);
                  }, fail: res => {
                    console.log(res);
                  },
                })
              }
              setTimeout(function () {
                that.goback();
              }, 1000)
            }
          })
        } else if (res.data.code == "404") {
          common.loginFail();
        } else if (res.data.code == "500") {
          common.showAlertToast("数据错误，请重试！");
        }else {
          common.showAlertToast("数据错误，请重试！");
        }

      },
      fail: function (res){
        common.loginFail();
      }
    })
  },
})