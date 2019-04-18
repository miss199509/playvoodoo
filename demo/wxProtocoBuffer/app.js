//app.js
App({
  onLaunch: function () {

    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting)

        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials:true,
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }

      }
    })
    wx.getSystemInfo({
      success: function (res) {
        var name = 'iPhone X';
        console.log(res)
        if (res.model.indexOf(name) > -1) {
          that.globalData.isIpx = true
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    //url:'https://gate1.thedoc.cn:8080',
    url:'https://aaa.thedoc.cn:8080',
    code:'',
    latitude:'',
    longitude:'',
    isIpx:false,
    appname:'miniprog',
    appversion:'1.0.0'
  }
})