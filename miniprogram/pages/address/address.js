// searchMapLocation.js

const app = getApp()
var QQMapWX = require('/../../pages/lib/qqmap-wx-jssdk.js');

var common = require('/../../pages/common/common.js');

var header = app.globalData.header;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    currentLat: '',
    currentLon: '',
    markers: [],
    keyword: '宋庄'
  },
  
  goback() {
    wx.navigateBack({ delta: 1 })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.location != undefined && options.location != "undefined" ){
      var location = JSON.parse(options.location);
      that.setData({
        keyword: location.title,
        currentLat: location.location.lat,
        currentLon: location.location.lng,
        markers: [{ latitude: location.location.lat, longitude: location.location.lng, iconPath: '../../images/point.png' }]
      })
      that.configMap();
    }else{

      that.getCurrentLocation();
    }
  },

  onShow:function(){
    var that = this;
    wx.getStorage({
      key: 'map_location',
      success: function (res) {
        wx.removeStorage({
          key: 'map_location'
        })
        that.setData({
          keyword:res.data.title,
          currentLat: res.data.location.lat,
          currentLon: res.data.location.lng,
          markers: [{ latitude: res.data.location.lat, longitude: res.data.location.lng, iconPath: '../../images/point.png' }]
        })
        that.configMap();
      }
    })
  },

  /**
   * 地图
   */
  getCurrentLocation: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          currentLat: latitude,
          currentLon: longitude,
          markers: [{ latitude: latitude, longitude: longitude, iconPath: '../../images/point.png' }]
        })
        that.configMap();
      },
    })
  },

  // 调用接口
  configMap: function () {
    var that = this;

    var qqmapsdk = new QQMapWX({
      key: 'GV7BZ-RWP3W-Y52RR-RPYDN-6FWLZ-QXFQT'
    });
    qqmapsdk.search({
      keyword: that.data.keyword,
      location: {
        latitude: that.data.currentLat,
        longitude: that.data.currentLon
      },
      complete: function (res) {
        that.setData({
          addressList: res.data
        })
      }
    });
  },

  //点击地址
  didSelectCell: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    
    wx.setStorage({
      key: 'map_location',
      data: that.data.addressList[index],
    })

    wx.navigateBack({
      delta: 1
    })
  },

  // 点击搜索框
  bindSearchTap: function () {
    wx.navigateTo({
      url: 'searchMapLocation/searchMapLocation',
    })
  }

})