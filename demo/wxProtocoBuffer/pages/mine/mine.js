
const app = getApp()
Page({
  data: {
    mineData:[
      // { url: 'https://img.thedoc.cn/wx/Group%202.png', title: '我的沟通' },
      { url: 'https://img.thedoc.cn/wx/Group.png', title: '我的医生' },
      // { url: 'https://img.thedoc.cn/wx/Shape.png', title: '我的订单' }
    ],
    nodes: [
      {
        name: 'img',
        attrs: {
          class: 'div_class',
          src: 'https://img.thedoc.cn/wx/tab_ic_found_Selected.png',
          width: '24px;',
          height: '24px;'
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
          text: '医生'
        }]
      }
    ],
    nodes1: [
      {
        name: 'img',
        attrs: {
          class: 'div_class',
          src: 'https://img.thedoc.cn/wx/tab_ic_found_Selected@2x.png',
          width: '24px;',
          height: '24px;'
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
          text: '我的'
        }]
      }
    ]
  },
  onLoad: function () {
    this.setData({
      isIpx: app.globalData.isIpx
    })
  },
  doctorsEve(){
    //console.log(getCurrentPages())
    wx.redirectTo({
      url: '../doctorsList/doctorsList'
    });
  },
  doctorsHref(event){
    let index = event.currentTarget.dataset['index'];
    console.log(index)
    if (this.data.mineData[index].title=='我的医生'){

      wx.navigateTo({
        url: '../miDoctors/miDoctors'
      });

    }
  },
  docHref() {
    wx.navigateTo({
      url: '../doctorsList/doctorsList'
    })
  }
})
