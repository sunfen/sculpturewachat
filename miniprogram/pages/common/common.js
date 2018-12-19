function errorWarn(content) {
  wx.showModal({
    content: content,
    showCancel: false
  })
}
module.exports.errorWarn = errorWarn;