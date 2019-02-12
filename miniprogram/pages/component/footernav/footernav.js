const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定

  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    gotoCompanyIndex: function () {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    },
    gotoMessages: function () {
      console.log("圈子");
    },
    bindViewMy: function () {
      wx.navigateTo({
        url: '/pages/user/user',
      })
    },
  
  }

})
