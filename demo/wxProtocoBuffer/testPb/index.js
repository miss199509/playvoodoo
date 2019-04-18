
const app = getApp();
var protobuf = require('../weichatPb/protobuf.js');
var awesomeConfig = require('talk.js');//加载awesome.proto对应的json
var AwesomeRoot = protobuf.Root.fromJSON(awesomeConfig);
var AwesomeMessage = AwesomeRoot.lookupType("ChatMsg");


var ChatMsg = { 
  uid: "2132", 
  sessionId:"123462",
  sender:"1",
  type: '3',
  text: "talk"
};

var message = AwesomeMessage.create(ChatMsg);
var buffer = AwesomeMessage.encode(message).finish();
console.log(buffer)
//链接websocket
var SocketTask = wx.connectSocket({
  url: 'wss://aaa.thedoc.cn:8080/chat?token=b89eccc7c81f41d09db52f4305a3a587'
});
//初始化连接
wx.onSocketOpen(function (res) {
  console.log(res)
  //向服务器发送数据
  sendSocketMessage();
});
//服务器返回数据
wx.onSocketMessage(function (res){
  console.log(res.data.length);
  
})
//向服务器发送数据
function sendSocketMessage(){
  wx.sendSocketMessage({
    data: buffer
  })
};

//解析服务器传输的地址
function char2buf(str) {
  var out = new ArrayBuffer(str.length)
  var u8a = new Uint8Array(out)
  var strs = str.split("")
  for (var i = 0; i < strs.length; i++) {
    u8a[i] = strs[i].charCodeAt()
  }
  return out
}
