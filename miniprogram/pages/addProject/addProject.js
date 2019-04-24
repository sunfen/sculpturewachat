// pages/index/addProject.js
const app = getApp()

var header = app.globalData.header;

var common = require('/../../pages/common/common.js');
var util = require('../../util/util.js');

Page({
  data: {
    i: 0,
    fail : 0,
    success: 0,
    images:[],
    project:{
      id:"",
      principal:{id:'', name:'',phone:""},
      name:'',
      address:'',
      dailyWages:'0',
      images:[],
      removeImages:[]
    }
  },
  
 
  goback() {
    wx.navigateBack({ delta: 1 })
  },

  onShow(){
    var that = this;
    var mapLocation = wx.getStorageSync('map_location');
    var projectPrincipal = wx.getStorageSync('project_principal');
    var images = wx.getStorageSync('images');
    var removeImages = wx.getStorageSync("removeImages");

    if (mapLocation) {
      that.setData({ address: mapLocation.address, ["project.address"]: mapLocation.address, location: mapLocation })
      wx.removeStorageSync('map_location');
    }

    if (images) {
      that.setData({ images: images })
      wx.removeStorageSync('images');
    }

    if (removeImages) {
      that.setData({ ['project.removeImages']: removeImages })
      wx.removeStorageSync('removeImages');
    }

    if (projectPrincipal) {
      that.setData({ ['project.principal']: projectPrincipal })
      wx.removeStorageSync('project_principal');
    }
  },

  onLoad(options){
    var that = this;
    common.checkLogin();
    setTimeout(function () {

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
                images: res.data.images
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
          images: project.images,
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
    wx.showLoading({
      title: '保存中',
    })
    wx.request({
      url: getApp().globalData.urlPath + 'project',
      method: "POST",
      data: that.data.project,
      header: header,
      success: function (res) {
        if (res.data.code == "200") {
          if(that.data.images.length == 0){
            wx.hideLoading();
            wx.showToast({
              title: '保存成功！',
              icon: 'success',
              success(res) {
                that.goback();
              }
            })
          }else{

            that.setData({i : 0, fail : 0 , success: 0})
            that.uploadimg(res.data.t);
          }

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

  uploadimg(objectId){
    var that = this;
    var i = that.data.i;//当前上传的哪张图片
    var success = that.data.success;//上传成功的个数
    var fail = that.data.fail;//上传失败的个数
    var image = that.data.images[i];
    if (image.id){
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == that.data.images.length) {
        wx.hideLoading(); //当图片传完时，停止调用          
        wx.showToast({
          title: '成功上传：' + success + " 张，失败：" + fail + " 张",
          icon: 'success',
          success(res) {
            that.goback();
          }
        })
      } else {//若图片还没有传完，则继续调用函数
        that.setData({ i: i, fail: fail, success: success });
        that.uploadimg(that.data);
      }
    }else{
        wx.uploadFile({
          header: header,
          url: getApp().globalData.urlPath + 'document',
          filePath: image.path,
          name: 'file',
          formData: { objectId : objectId},
          success: (resp) => {
            success++;//图片上传成功，图片上传成功的变量+1
          },
          fail: (res) => {
            fail++;//图片上传失败，图片上传失败的变量+1
            console.log('fail:' + i + "fail:" + fail);
          },
          complete: () => {
            
            i++;//这个图片执行完上传后，开始上传下一张
            if (i == that.data.images.length) {  
              wx.hideLoading(); //当图片传完时，停止调用          
              wx.showToast({
                title: '成功上传：' + success + " 张，失败：" + fail + " 张",
                icon: 'success',
                success(res) {
                  that.goback();
                }
              })
            } else {//若图片还没有传完，则继续调用函数
              that.setData({i: i, fail : fail, success : success});
              that.uploadimg(that.data);
            }
          }
        });
    }
  }
})