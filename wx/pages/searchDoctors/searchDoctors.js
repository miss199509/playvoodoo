
const app = getApp()
const url = app.globalData.url;

Page({
  data:{
    inputValue:''
  },
  onLoad:function(){

    let token = wx.getStorageSync('token');
    
    console.log(token)

    let _this = this;
    if (app.globalData.latitude==''){
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          //console.log(res);
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            token: token
          })
        }
      })
    }else{

      _this.setData({
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        token: token
      })

    }


    console.log(wx.getSystemInfoSync().windowHeight)
    this.setData({
      doctorsHei: wx.getSystemInfoSync().windowHeight
    })
  },
  lower(){
    console.log(0)
  },
  //跳转到医生详情
  detailsEve(event){
    let index = event.currentTarget.dataset['index'];
    let data = this.data.doctorsData[index];
    //console.log(data['id'])
    wx.navigateTo({
      url: '../details/details?memberId=' + data['id']
    });

  },
  realnameEve(e){
    let _this = this;
    if (e.detail.value==''){
      e.detail.value = '***'
    }
    var val = encodeURI(e.detail.value);
    console.log(val, _this.data.longitude, _this.data.latitude)
    let name = encodeURI('医护人员');
    wx.request({
      url: url + '/mixi/find/screen/?longitude=' + _this.data.longitude + '&latitude=' + _this.data.latitude + '&realname=' + val + '&name=' + name,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': _this.data.token, // 默认值
        'appname': app.globalData.appname,
        'appversion': app.globalData.appversion
      },
      success: res => {
        console.log(JSON.stringify(res.data));
        
        if (res.data.code==0){


          //处理特殊字符
          for (let i in res.data.data) {
            let speData = res.data.data[i].specialty;
            if (speData != undefined) {
              res.data.data[i].specialty = speData.replace('[', '').replace(']', '')
              if (res.data.data[i].specialty.length > 18) {
                res.data.data[i].specialty = res.data.data[i].specialty.substr(0, 20) + '...';
              }
            }
          }

          let data = res.data.data;
          for (let i in data){
            //console.log(data[i].specialty);
            if(data[i].specialty!=undefined){
              data[i].specialty = data[i].specialty.replace(/\[|]/g,'')
            }
          }
          _this.setData({
            doctorsData: data
          })
        }
        if (res.data.code == 1){

          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
            duration: 2000
          });
        }
        if (res.data.code == 2) {
          wx.showModal({
            title: '登陆失效',
            content: '您的登录已失效，请重新登录',
            complete: function () {
              wx.removeStorage({
                key: 'token',
                success(res) {
                  console.log(res.data)
                  console.log(0)
                }
              })
              wx.removeStorage({
                key: 'doctorsList',
                success(res) {
                  console.log(res.data)
                }
              })
              wx.reLaunch({
                url: '../signIn/signIn'
              })

            }
          })
        }

      }
    });

  },
  //移除搜索
  removeEve(){
    this.setData({
      inputValue:'',
      doctorsData:[]
    });
  }
})