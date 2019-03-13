//index.js
const app = getApp()


var common = require('/../../pages/common/common.js');


var header = app.globalData.header;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    //用户个人信息
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    count:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({userInfo : getApp().globalData.userInfo});
  },

  onShow(){
    var that = this;
    that.init();
  },

  about:function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  myPrincipal(){
    wx.navigateTo({
      url: '/pages/myPrincipal/myPrincipal',
    })
  },


  myProject() {
    wx.navigateTo({
      url: '/pages/myProject/myProject',
    })
  },



  myWages() {
    wx.navigateTo({
      url: '/pages/myWages/myWages',
    })
  },

  importor() {
    wx.navigateTo({
      url: '/pages/importor/importor',
    })
  },


  previewImage(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  switchChange(e){
    var that = this;
    that.setData({ switchChange: e.detail.value})
  },


  /**
   * 获取init数据
   */
  init() {
    var that = this;
    wx.request({
      header: header,
      url: getApp().globalData.urlPath + 'my',
      success(res) {
        if (res.data) {
          that.setData({
            count: res.data
          });
        }
      }
    })
  },


  //用户按了允许授权按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              header: header,
              url: getApp().globalData.urlPath + 'login/session/' + res.code,
              method: 'GET',
              header: header,
              success: function (res) {
                //从数据库获取用户信息
                that.setData({ isLogin: true });
                if (res.data.code == "200") {
                  //从数据库获取用户信息
                  getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.t;
                  getApp().globalData.userInfo = e.detail.userInfo;
                  var avatarUrl = 'userInfo.avatarUrl';
                  var nickName = 'userInfo.nickName';
                  var openLoginSet = that.data.openLoginSet;
                  that.setData({
                    [avatarUrl]: e.detail.userInfo.avatarUrl,
                    [nickName]: e.detail.userInfo.nickName,
                    openLoginSet: false
                  })
                  if (openLoginSet) {
                    that.shareFrends();
                  }
                } else {
                  common.loginFail();
                }
              },
              fail: function (res) {
                common.loginFail();
              }
            })
          }
        }
      })
    } else {
      common.errorWarn("您点击了拒绝授权");
    }
  },


// 分享
shareFrends() {
  let that = this;
  if (that.data.userInfo.avatarUrl == "" || that.data.userInfo.avatarUrl == undefined){
    that.setData({ openLoginSet : true});
    return;
  }

  
  let avatar = that.data.userInfo.avatarUrl;// 头像
  const post_cover = '/images/wx.jpg'; //没有封面图时设置默认图片
  wx.getImageInfo({   // 根据头像地址下载头像并存为临时路径
    src: avatar,
    success: res => {
      that.setData({
        avatar: res.path
      })
      wx.getImageInfo({ // 封面图
        src: post_cover,
        success: res => {
          that.setData({
            cover: res.path,
            coverWidth: res.width,  //封面图的宽
            coverHeight: res.height //封面图的高
          })
  
            wx.getImageInfo({
              src: avatar,
              success: res => {
                that.setData({
                  erweima: res.path
                })

                  that.createdCode() // 根据以上信息开始画图
                  //canvas画图需要时间而且还是异步的，所以加了个定时器
                  setTimeout(() => {
                    // 将生成的canvas图片，转为真实图片
                    wx.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      canvasId: 'shareFrends',
                      success: function (res) {
                        let shareImg = res.tempFilePath;
                        that.setData({
                          shareImg: shareImg,
                          showModal: true,
                          showShareModal: false
                        })
                        },
                      fail: function (res) {
                        common.showAlertToast('生成失败');
                      }
                    })
                  }, 500)
                }, fail(err) {
                 common.showAlertToast('生成失败');
                }
              })
          },
          fail(err) {
            common.showAlertToast('生成失败');
          }
        })
      },
      fail(err) {
        common.showAlertToast('生成失败');
      }
    })
},



  //开始绘图
  createdCode() {
    let that = this;
    const ctx = wx.createCanvasContext('shareFrends');    //绘图上下文
    const name = "雕塑记";     //绘图的标题  需要处理换行
    const coverWidth = this.data.coverWidth; // 封面图的宽度 裁剪需要
    const coverHeight = this.data.coverHeight; // 封面图的宽度 裁剪需要
    let pichName = that.data.userInfo.nickName;  //用户昵称
    const explain = 'Hi,我想分享给你一条资讯猛料!';
    // 截取昵称 超出省略。。。
    if (pichName.length > 16) {   //用户昵称显示一行 截取
      pichName = pichName.slice(0, 9) + '...'
    };


    // 绘制logo
    ctx.save()
    // canvas 背景颜色设置不成功，只好用白色背景图
    ctx.drawImage('/images/backimage.jpg', 0, 0, 286, 480);

    // 绘制标题
    ctx.font = 'normal bold 14px sans-serif';
    ctx.setTextAlign('left');
    const nameWidth = ctx.measureText(name).width;

    // 标题换行  16是自已定的，为字体的高度
    this.wordsWrap(ctx, name, nameWidth, 52, 126, 22, 16);
    // 计算标题所占高度
    const titleHight = Math.ceil(nameWidth / 252) * 16;
   
    // 绘制头像和昵称
    ctx.arc(36, 40 + titleHight, 20, 0, 2 * Math.PI);
    ctx.clip()
    
    ctx.drawImage(this.data.avatar, 16, 18 + titleHight, 44, 44);
    ctx.restore();
    
    ctx.font = 'normal normal 14px sans-serif';
    ctx.setTextAlign('left');
    ctx.setFillStyle('#bbbbbb')
    ctx.fillText(pichName, 70, 50 + titleHight);
 
    // 二维码描述 
    ctx.setFillStyle('#333333')
    ctx.fillText(explain.slice(0, 11), 30, 90 + titleHight);   // 描述截取换行
    ctx.fillText(explain.slice(11), 30, 110 + titleHight);


    // 绘制 封面图并裁剪（这里图片确定是按100%宽度，同时高度按比例截取，否则图片将会变形）
    // 裁剪位置  图片上的坐标  x:0 ,y: (coverHeight - 129 * coverWidth / 252) / 2
    // 图片比例 255:129   图片宽度按原图宽度即coverWidth  图片高度按129*coverWidth/252
    // 开始绘图的位置  16, 94
    // 裁剪框的大小，即需要图片的大小 252, 129
    ctx.drawImage(this.data.cover, 0, 0, coverWidth, coverHeight, 16, 140, 252, 252);
    
    ctx.setFontSize(10);
    ctx.setFillStyle('#bbbbbb')
    ctx.fillText('长按扫码查看详情', 70, 405);

    ctx.draw()
  },


  //文字换行处理
  // canvas 标题超出换行处理
  wordsWrap(ctx, name, nameWidth, maxWidth, startX, srartY, wordsHight) {
    let lineWidth = 0;
    let lastSubStrIndex = 0;
    for (let i = 0; i < name.length; i++) {
      lineWidth += ctx.measureText(name[i]).width;
      if (lineWidth > maxWidth) {
        ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
        srartY += wordsHight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == name.length - 1) {
        ctx.fillText(name.substring(lastSubStrIndex, i + 1), startX, srartY);
      }
    }
  },



  // 长按保存事件
  saveImg() {
    let that = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.shareImg,
                success() {
                  common.errorWarn('保存成功');
                },
                fail() {
                  common.showAlertToast('保存失败')
                }
              })
            },
            fail() {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              that.setData({
                openSet: true
              })
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: that.data.shareImg,
            success() {
              common.errorWarn('保存成功');
            },
            fail() {
              common.showAlertToast('保存失败')
            }
          })
        }
      }
    })
  },



  //js

  // 授权
  cancleSet() {
    this.setData({
      openSet: false,
      openLoginSet : false,
      showModal: false
    })
  },
})

