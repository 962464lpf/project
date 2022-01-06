const app = getApp()

module.exports.httpRequest = ({url, data = {}, method}) => {
	const dataObj= {
		openId: wx.getStorageSync('openId') || '',
		...data
	}
	return new Promise((resolve, reject) => {
		wx.showLoading()
		wx.request({
		  url: app.globalData.baseUrl + url,
		  data: dataObj,
			timeout: 60000,
		  header: {
		    'content-type': 'application/json;charset=utf-8' // 默认值
		  },
			method: method,
		  success(res) {
				wx.hideLoading()
				const code = res.data.code || 200
				if (code === 200) {
					resolve(res.data)
				} else if (code === 403) {
					wx.showModal({
					  title: '提示',
					  content: '您当前的登录身份已失效，是否重新授权登录？',
					  success (res) {
					    if (res.confirm) {
					      wx.navigateTo({
									url: '/pages/login/index'
								})
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
				} else if (code === 401) {
					wx.showToast({
					  title: '当前未登录',
					  icon: 'none',
					  duration: 1500
					})
					reject(res.data.msg)
				} else {
					wx.showToast({
					  title: res.data.msg,
					  icon: 'none',
					  duration: 2000
					})
				}
		  },
			fail(res) {
				wx.hideLoading()
				reject(res.data)
			}
		})
	})
}