// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const openId = wx.getStorageSync('openId')
    if (!openId) {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/index',
        })  
      }, 1000)
    }
  },
  globalData: {
    userInfo: null,
    baseUrl: 'https://test.gdtems.com',
    // baseUrl: 'https://gdtems.com',
    // baseUrl: 'http://123.56.26.169:8080',
		uploadAvatar: '/wechat/txl/avatar',
		uploadApi: '/wechat/txl/uploadImg'
  }
})
