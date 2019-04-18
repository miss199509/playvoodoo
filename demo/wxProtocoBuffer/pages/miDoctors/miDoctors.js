
const app = getApp()
const url = app.globalData.url;

Page({
  data: {
    boll:true
  },
  onLoad: function (options) {
    let _this = this;
    this.setData({
      'wx': options.wx
    })
    wx.showLoading({
      'title':'加载中'
    });
    let token = wx.getStorageSync('token');
    console.log(token);

    wx.request({
      url: url + '/my/doctor/list/',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': token, // 默认值
        'appname': app.globalData.appname,
        'appversion': app.globalData.appversion
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        console.log(JSON.stringify(res.data))
        for (let i in res.data.data){
          let val = JSON.parse(res.data.data[i].specialty);
          res.data.data[i].specialty = val[0];
        }
        if (res.data.code == 0) {
          if (!res.data.data.length) {
            _this.setData({
              boll:false
            })
          }
          _this.setData({
            attrList: res.data.data
          })
        }
        if(res.data.code==2){

          wx.showModal({
            title: '登陆失效',
            content: '您的登录已失效，请重新登录',
            complete: function () {

              wx.removeStorage({
                key: 'token',
                success(res) {
                  console.log(res.data)
                }
              })
              wx.removeStorage({
                key: 'doctorsList',
                success(res) {
                  console.log(res.data)
                }
              })
              if (_this.data.wx == 1) {
                wx.reLaunch({
                  url: '../signIn/signIn?miDoctors=1'
                });
              } else {
                wx.reLaunch({
                  url: '../signIn/signIn'
                });
              }

            }
          })
        }
      }
    });
  },
  docHref() {
    wx.redirectTo({
      url: '../doctorsList/doctorsList'
    })
  },
  miDoctEve(event){
    let index = event.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '../details/details?memberId=' + this.data.attrList[index]['id']
    });

  }
})
