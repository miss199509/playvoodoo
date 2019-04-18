
const app = getApp()
const url = app.globalData.url;

Page({
  data: {
    teamData:{
      url:'https://img.thedoc.cn/wx/icon_1.png',
      boll:false
    },
    assistantData:{
      url: 'https://img.thedoc.cn/wx/icon_1.png',
      boll: false
    },
    simpleData:{
      url: 'https://img.thedoc.cn/wx/icon_1.png',
      boll: false
    },
    nodes: [
      {
        name: 'label',
        attrs: {
          class: 'label',
          style: ''
        },
        children: [{
          type: 'text',
          text: '个人简介：'
        }]
      },
      {
        name: 'p',
        attrs: {
          class: 'p',
          style: ''
        },
        children: [{
          type: 'text',
          text: '中医学基础理论，针灸，推拿的理论和操作技'
        }]
      }
    ]
  },
  onLoad: function (options) {
    let _this = this;
    let token = wx.getStorageSync('token');
    var memberId = options.memberId;
    //判断是不是公众号跳转
    this.setData({
      'memberId': memberId,
      'token': token,
      'wx': options.wx
    });
    console.log(memberId)
    wx.showLoading();
    wx.request({
      url: url + '/user/member/info/?memberId=' + memberId,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'token': token,
        'appname': app.globalData.appname,
        'appversion': app.globalData.appversion
      },
      complete() {  //请求结束后隐藏 loading 提示框
      },
      success: res => {
        console.log(JSON.stringify(res.data))
        switch (res.data.code) {
          case 0:
            let detailsList = res.data.data;

            wx.hideLoading();
            let introduce = detailsList.introduce;
            console.log(introduce.length)
            if (introduce.length>50){
              introduce = introduce.substring(0,40)+'...';
              console.log(introduce)
            } 
            _this.setData({
              detailsList: detailsList,
              'nodes[1].children[0].text': introduce
            })
            break;
          case 1:

            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 2000
            });
            break;
          case 2:
            console.log(0)
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
                if (_this.data.wx==1){
                  wx.reLaunch({
                    url: '../signIn/signIn?details=1&memberId=' + _this.data.memberId
                  });
                } else {
                  wx.reLaunch({
                    url: '../signIn/signIn'
                  });
                }

              }
            });

            break;
        }

      }
    });


  },
  //团队查看更多
  moreEve:function(){
    console.log(this.data.memberId)
    let _this = this;
    wx.request({
      url: url + '/user/label/list/?memberId=' + _this.data.memberId +'&type=2',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'token': _this.data.token,
        'appname': app.globalData.appname,
        'appversion': app.globalData.appversion
      },
      complete() {  //请求结束后隐藏 loading 提示框
      },
      success: res => {
        console.log(JSON.stringify(res.data))
        console.log(typeof (res.data.data))
        if (!res.data.code){
          if (typeof (res.data.data) == 'string'){

            wx.showToast({
              title: '暂无更多',
              icon: 'none',
              duration: 2000
            });

          } else {
            let data = res.data.data;
            _this.setData({
              'detailsList.team': data
            })
          }
        }

      }
    });
  },
  teamEve(){
    if (this.data.teamData.boll) {
      this.setData({
        'teamData.url': 'https://img.thedoc.cn/wx/icon_1.png',
        'teamData.boll': false
      })
    } else {
      this.setData({
        'teamData.url': 'https://img.thedoc.cn/wx/icon_11.png',
        'teamData.boll': true
      })
    }
  },
  assistantEve(){

    if (this.data.assistantData.boll) {
      this.setData({
        'assistantData.url': 'https://img.thedoc.cn/wx/icon_1.png',
        'assistantData.boll': false
      })
    } else {
      this.setData({
        'assistantData.url': 'https://img.thedoc.cn/wx/icon_11.png',
        'assistantData.boll': true
      })
    }
  },
  simpleEve(){
    if (this.data.simpleData.boll) {
      
      let introduce = this.data.detailsList.introduce;
      console.log(introduce.length)
      if (introduce.length > 50) {
        introduce = introduce.substring(0, 40) + '...';
        console.log(introduce)
      }
      this.setData({
        'simpleData.url': 'https://img.thedoc.cn/wx/icon_1.png',
        'simpleData.boll': false,
        'nodes[1].children[0].text': introduce
      })
    } else {
      this.setData({
        'simpleData.url': 'https://img.thedoc.cn/wx/icon_11.png',
        'simpleData.boll': true,
        'nodes[1].children[0].text': this.data.detailsList.introduce
      })

    }
  }
})
