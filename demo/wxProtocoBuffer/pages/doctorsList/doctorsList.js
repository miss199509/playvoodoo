
const app = getApp()
const url = app.globalData.url;

Page({
  data:{
    //我的
    doctIfBoll:true,
    mineData: [
      // { url: 'https://img.thedoc.cn/wx/Group%202.png', title: '我的沟通' },
      { url: 'https://img.thedoc.cn/wx/Group.png', title: '我的医生' },
      // { url: 'https://img.thedoc.cn/wx/Shape.png', title: '我的订单' }
    ],

    //下拉加载开关
    bottomLoad:true,
    loadBoll:false,
    attrData: [],
    data: [],
    num: 1,
    nodes: [
      {
        name: 'img',
        attrs: {
          class: 'div_class',
          src:'https://img.thedoc.cn/wx/tab_ic_found_Selected1.png',
          width:'24px;',
          height:'24px;'
        }
      },
      {
        name: 'label',
        attrs: {
          class: 'name',
          style: 'display:block;color: #D43E72;font-size:10px;'
        },
        children: [{
          type: 'text',
          text: '医生'
        }]
      }
    ],
    nodes1: [
      {
        name: 'img',
        attrs: {
          class: 'div_class',
          src: 'https://img.thedoc.cn/wx/tab_ic_found_Selected@3x.png',
          width:'24px;',
          height:'24px;'
        }
      },
      {
        name: 'label',
        attrs: {
          class: 'name',
          style: 'display:block;color: #9B9B9B;font-size:10px;'
        },
        children: [{
          type: 'text',
          text: '我的'
        }]
      }
    ]
  },
  onLoad: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中'
    });
    console.log(app.globalData.isIpx)
    //判断是否缓存了本地数据
    let doctorsBollList = wx.getStorageSync('doctorsList');
    console.log(doctorsBollList)
    if (doctorsBollList != '') {
      wx.hideLoading();

      _this.setData({
        data: doctorsBollList,
        loadBoll: true
      })
      for (let i in doctorsBollList.data) {
        _this.data.attrData.push(doctorsBollList.data[i]);
      }
      _this.setData({
        doctorsData: _this.data.attrData,
        topVal:21
      })
    };
    
    //获取经纬度
    let token = wx.getStorageSync('token');
    console.log(token)
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          token: token,
          isIpx: app.globalData.isIpx
        })
        //调用方法获取数据没有缓存
        if (doctorsBollList == '') {
          _this.load(_this.data.num);
        }
      }
    })


    console.log(wx.getSystemInfoSync().windowHeight)
    let height = wx.getSystemInfoSync().windowHeight;
    if (app.globalData.isIpx){
      height = wx.getSystemInfoSync().windowHeight - 15;
    };
    this.setData({
      doctorsHei: height,
      isIpx: app.globalData.isIpx
    })
  },
  lowTop() {
    console.log(0)
    this.load(1);
  },
  lowBottom(){
    
    if(this.data.bottomLoad){
      this.setData({
        bottomLoad:false
      })
      if (this.data.data.pager.hasNext) {
        this.load(this.data.num += 1);
        return false;
      }
    }
  },
  load(num){
    let _this = this;
    let name = encodeURI('医护人员');
    //console.log(_this.data.latitude+'***')
    wx.request({
      url: url + '/mixi/find/screen/?name=' + name + '&longitude=' + _this.data.longitude + '&latitude=' + _this.data.latitude + '&page=' + num,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': _this.data.token, // 默认值
        'appname': app.globalData.appname,
        'appversion': app.globalData.appversion
      },
      complete() {  //请求结束后隐藏 loading 提示框
        wx.hideLoading();
      },
      success: res => {
        //console.log(JSON.stringify(res.data))
        if (res.data.code == 0) {
          //处理特殊字符
          for (let i in res.data.data){
            let speData = res.data.data[i].specialty;
            if (speData!=undefined){
              res.data.data[i].specialty = speData.replace('[', '').replace(']', '')
              if (res.data.data[i].specialty.length>18){
                res.data.data[i].specialty = res.data.data[i].specialty.substr(0,20)+'...';
              }
            }
          }
          //缓存到本地
          //console.log(num)
          if (num == 1) {
            console.log('上拉加载')
            wx.setStorage({
              key: 'doctorsList',
              data: res.data
            });
            _this.setData({
              topVal: 21,
              attrData: [],
              num: 1
            })
          }

          let data = res.data.data;
          _this.setData({
            data: res.data,
            loadBoll:true,
            bottomLoad:true
          })
          for (let i in data){
            _this.data.attrData.push(data[i]);
          }
          _this.setData({
            doctorsData: _this.data.attrData
          })
          if(num==1){
            _this.setData({
              topVal:21
            })
          }
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
  mineHref(){
    this.setData({
      doctIfBoll: false,
      'nodes[0].attrs.src':'https://img.thedoc.cn/wx/tab_ic_found_Selected.png',
      'nodes1[0].attrs.src':'https://img.thedoc.cn/wx/tab_ic_found_Selected@2x.png',
      'nodes[1].attrs.style': 'display:block;color: #9B9B9B;font-size:10px;',
      'nodes1[1].attrs.style': 'display:block;color: #D43E72;font-size:10px;'
    });
  },
  docHref(){
    this.setData({
      doctIfBoll: true,
      'nodes[0].attrs.src': 'https://img.thedoc.cn/wx/tab_ic_found_Selected1.png',
      'nodes1[0].attrs.src': 'https://img.thedoc.cn/wx/tab_ic_found_Selected@3x.png',
      'nodes[1].attrs.style': 'display:block;color: #D43E72;font-size:10px;',
      'nodes1[1].attrs.style': 'display:block;color: #9B9B9B;font-size:10px;'
    });
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
  doctorsHref(event) {
    let index = event.currentTarget.dataset['index'];
    console.log(index)
    if (this.data.mineData[index].title == '我的医生') {

      wx.navigateTo({
        url: '../miDoctors/miDoctors'
      });

    }
  },
  searchEve(){
    
    wx.navigateTo({
      url: '../searchDoctors/searchDoctors'
    });

  },
  errImg(index){
    
    let errIndex = index.target.dataset.errImg;
    var deletedtodo = 'doctorsData['+errIndex+'].portrait';
    this.setData({
      [deletedtodo]: 'https://img.thedoc.cn/wx/d.jpg'
    })



  }
})