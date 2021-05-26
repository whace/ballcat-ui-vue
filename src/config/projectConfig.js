module.exports = {
  // 项目标题
  projectTitle: 'Ball Cat',
  // 项目描述
  projectDesc: 'Ball Cat 一个简单的项目启动脚手架',
  // 开启 websocket，开启此选项需要服务端同步支持 websocket 功能
  enableWebsocket: false,
  // Vue ls 配置
  storageOptions: {
    namespace: 'ballcat/', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}


