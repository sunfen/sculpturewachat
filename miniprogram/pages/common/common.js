function errorWarn(content) {
  wx.showModal({
    content: content,
    showCancel: false
  })
}

module.exports.errorWarn = errorWarn;

function loginFail() {
  common.errorWarn("未能成功登录, 请重新登录");
}

module.exports.loginFail = loginFail;


function showAlertToast(message) {
  wx.showToast({
    title: message,
    icon: 'none',
  })
}

module.exports.showAlertToast = showAlertToast;