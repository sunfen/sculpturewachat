// pages/index/addProject.js
const app = getApp()

Page({
  data: {
    project:{
      principalName:'',
      principalPhone: '',
      name:'',
      address:'',
      date:'',
      time:'08:00',
      wages:'0'
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("接收到的参数 id=" + options.id);
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

  
  // 关闭详情页
  closeModal: function () {
    this.setData({
      showModalPrincipal: false,
      showModalWages: false,
      showModalName: false,
      showModalAddress: false
    })
  },


  //添加负责人
  addPrincipal() {
    this.setData({
      showModalPrincipal: true,
    })
  },

  //添加项目名称
  addName() {
    this.setData({
      showModalName: true
    })
  },


  //添加总工资
  addWages() {
    this.setData({
      showModalWages: true
    })
  },


  //添加地点
  addAddress() {
    this.setData({
      showModalAddress: true
    })
  },

  /**
   * 对话框确认按 负责人
   */
  onConfirm: function (e) {
    this.setData({
      showModalPrincipal: false,
      showModalWages: false,
      showModalName: false,
      showModalAddress: false,
      project: { 
        principalName: this.data.principalName, 
        principalPhone: this.data.principalPhone,
        name: this.data.name,
        address: this.data.address,
        time: this.data.time,
        date: this.data.date,
        wages: this.data.wages,
     }
    })
  },


  /**
   * 输入框输入事件
   */
  inputValue:function(e){
    var name = e.target.id;
    console.log(e);
    if(name == "principalName"){
      this.setData({
        principalName: e.detail.value
      })
      return;
    }

    if (name == "principalPhone") {
      this.setData({
        principalPhone: e.detail.value
      })
      return;
    }

    if (name == "name") {
      this.setData({
        name: e.detail.value
      })
      return;
    }

    if (name == "address") {
      this.setData({
        address: e.detail.value
      })
      return;
    }


    if (name == "wages") {
      this.setData({
        wages: e.detail.value
      })
      return;
    }

    if (name == "time" || name == "date") {
      if(name == "time"){
        this.setData({
          time: e.detail.value
        })
      }
      if (name == "date") {
        this.setData({
          date: e.detail.value
        })
      }
      this.setData({
        showModalPrincipal: false,
        showModalWages: false,
        showModalName: false,
        showModalAddress: false,
        project: {
          principalName: this.data.principalName,
          principalPhone: this.data.principalPhone,
          name: this.data.name,
          address: this.data.address,
          time: this.data.time,
          date: this.data.date,
          wages: this.data.wages,
        }
      })
    }
  },

  //新增完
  sure() {
    wx.showToast({
      title: '成功添加！',
      icon: 'success',
      success(res){
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 1000) 
      
      }
    })
  },

})