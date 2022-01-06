export default class WebSocketClass {
  constructor(wsUrl, messageCallback) {
    this.instance = null
    this.wsUrl = wsUrl
    this.status = null
    this.messageCallback = messageCallback
    this.connect(wsUrl)
  }
  //获取Websocket的实例
  static getInstance() {
    if(!this.instance) {
      this.instance = new WebSocketClass()
    }
    return this.instance
  }

  connect(wsUrl) {
    this.ws = new WebSocket(wsUrl)
    this.ws.onopen = e =>{
      this.status = 'open'
      console.log('连接成功',e)
      this.heartCheck();
      this.getMessage();
    }
  }

  //心跳机制
  heartCheck() {
    //心跳机制的时间可以自由设置(与后端)
    //连接成功默认为pong
    this.pingPong = 'pong'
    this.pingInterval = setInterval(() => {
      if (this.pingPong === 'ping') {
        // 如果后端没有返回pong, 则重启webSocket
        this.closeHandle('pingPong未改变为pong');
      }else {
        if(this.ws.readyState === 1) {
          //发送前重置为ping，检查连接状态,客户端发送ping
          this.pingPong = 'ping'
          this.ws.send('ping')
        }
      }
    }, 30000)
  }

  //关闭重启webSocket
  closeHandle(e = 'err') {
    if(this.status !== 'close') {
      console.log('断开重连',e)
      if(this.pingInterval !== undefined) {
        //清除定时器
        clearInterval(this.pingInterval)
      }
      //重连
      this.connect(this.wsUrl)
    }else {
      console.log('手动关闭，或正在重连')
    }
  }

  //获取后台发送的信息
  getMessage() {
    this.ws.onmessage = e => {
      const dataTem = JSON.parse(e.data)
      if(dataTem.key === 'ping' && dataTem.value === 'pong') {
        console.log('后台返回了pong')
        //后端返回pong，修改pingPong的状态
        this.pingPong = 'pong'
      }else {
        // console.log(e.data)
      }
      this.messageCallback(e)
      // console.log(e.data)
    }
  }

  close() {
    //清除定时器
    clearInterval(this.pingInterval)
    this.status = 'close'
    this.ws.send('close');
    this.ws.close();
    console.log('已关闭连接',this.ws)
  }
}
