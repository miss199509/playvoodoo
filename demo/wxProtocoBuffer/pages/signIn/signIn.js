//index.js
//获取应用实例
const app = getApp()
const url = app.globalData.url;
console.log(url)
Page({
  data: {
    phone:'',
    numTips:'获取验证码',
    setInter:'',
    num:30,
    //判断登录按钮
    signButtonBoll:false,
    code:'',
    unionId:''
  },
  onLoad: function (options){
    //我的医生
    var miDoctors = options.miDoctors;
    //医生详情
    var details = options.details;

    console.log(miDoctors, details);
    
    this.setData({
      miDoctors: options.miDoctors,
      details: options.details,
      memberId: options.memberId
    })

    let token = wx.getStorageSync('token');
    console.log(token);
    if(token!=''){
      // if (miDoctors==1){
      //   wx.redirectTo({
      //     url: '../miDoctors/miDoctors'
      //   });
      // }else if (details == 1) {
      //   wx.redirectTo({
      //     url: '../details/details?memberId=' + options.memberId
      //   });
      // }else{
      //   wx.redirectTo({
      //     url: '../doctorsList/doctorsList'
      //   });
      // }
      
      wx.redirectTo({
        url: '../doctorsList/doctorsList'
      });

    }
  },
  codeEve(e){
    var code = e.detail.value;
    console.log(code)
    this.setData({
      code:code
    })
  },
  getPhone:function(e){
    var val = e.detail.value;
    this.setData({
      phone:val
    })
  },
  //获取验证码
  btnclick: function () {


    let _this = this;
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    let phone = this.data.phone;
    if (_this.data.num < 30) {
      wx.showToast({
        title: '验证码已发送未收到60S后重新点击',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    //判断输入的手机号码格式是否正确
    if (!myreg.test(phone)){
      wx.showToast({
        title: '手机号码格式错误请重新输入',
        icon: 'none',
        duration: 2000
      });
      return false;
    };
    //登录按钮
    _this.setData({
      signButtonBoll:true
    });

    _this.data.setInter = setInterval(function () {
      _this.data.num -= 1;
      _this.setData({
        numTips: '已发送'+_this.data.num,
        num: _this.data.num
      });
      if (_this.data.num <= 0) {
        _this.setData({
          numTips: '获取验证码',
          num:30
        });
        clearInterval(_this.data.setInter)
      }

    } , 1000); 
    // 18516360572

    //return false;
    wx.request({
      url: url + '/user/phlogincode/?username=' + _this.data.phone, //请求接口的url
      method: 'POST', //请求方式
      data: {
      },//请求参数
      header: {
        'content-type': 'application/json', // 默认值
        'appname': app.globalData.appname,
        'appversion': app.globalData.appversion
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        console.log(res.data)
        if(res.data.code==0){

          // wx.showToast({
          //   title: '验证码发送成功',
          //   icon: 'none',
          //   duration: 2000
          // });

        }else{

          wx.showToast({
            title: '验证码发送失败，稍后再试',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },
  //登录
  signEve: function (e) {
    let _this = this;
    //获取uid
    console.log(e)
    console.log(e.detail.encryptedData);
    console.log(e.detail.iv);
    console.log(app.globalData.code);



    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //获取uid结束
    if (!this.data.signButtonBoll) {
      wx.showToast({
        title: '点击获取验证码',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    wx.request({
      url: url + '/wx/jscode2session/',
      method: 'POST', //请求方式
      data: {
        jscode: app.globalData.code,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      },
      header: {
        'content-type': 'application/json', // 默认值
        'appname': app.globalData.appname,
        'appversion': app.globalData.appversion
      },
      success: res => {
        console.log(res.data.data)
        if (res.data.code == 0) {
          //防止验证码输入错误
          if (res.data.data != undefined){
            _this.setData({
              unionId: res.data.data.unionId
            });
          }

          console.log(url + '/user/phlogin/?username=' + _this.data.phone + '&code=' + _this.data.code + '&unionId=' + _this.data.unionId)
          wx.request({
            url: url + '/user/phlogin/?username=' + _this.data.phone + '&code=' + _this.data.code + '&unionId=' + _this.data.unionId,
            method: 'POST', //请求方式
            header: {
              'content-type': 'application/json', // 默认值
              'appname': app.globalData.appname,
              'appversion': app.globalData.appversion
            },
            success: res => {
              if (res.data.code==0) {
                console.log(JSON.stringify(res.data))

                wx.setStorage({
                  key: 'token',
                  data: res.data.data.token
                });
                // 请求成功清楚定时器
                clearInterval(_this.data.setInter);


                if (_this.data.miDoctors == 1) {
                  wx.redirectTo({
                    url: '../miDoctors/miDoctors'
                  });
                } else if (_this.data.details == 1) {
                  wx.redirectTo({
                    url: '../details/details?memberId=' + _this.data.memberId
                  });
                } else {
                  wx.redirectTo({
                    url: '../doctorsList/doctorsList'
                  });
                }

              } else {
                wx.showToast({
                  title: '验证码错误',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          });


        }
      }
    });

    console.log('可以执行登录接口')

  },
  agreementEve(){

    wx.navigateTo({
      url: '../agreement/agreement'
    });

  },

  getUserInfo: function (e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})
