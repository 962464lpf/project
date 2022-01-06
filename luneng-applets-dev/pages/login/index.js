const app = getApp()
const homeApi = require('../../network/home.js')

Page({
  data: {
		username: '',
		password: '',
		code: '',
		showLogin: false
  },
	
  onLoad(options) {
		this.showLoginModel()
  },
	
  onReady() {
		
  },

  onShow() {
		
  },
	//授权框
	showLoginModel() {
		const openId = wx.getStorageSync('openId')
		const that = this
		if (!openId) {
			wx.showModal({
			  title: '授权登录',
			  content: '如果您是本集团员工或合作单位员工，请先授权登录再使用(暂不对其他人员开放)',
				confirmText: '确认授权',
				confirmColor: "#07c160",
				cancelText: '暂不授权',
				cancelColor: "#999999",
			  success (res) {
			    if (res.confirm) {
			      that.setData({
							showLogin: true
						})
			    } else if (res.cancel) {
			      console.log('用户点击取消')
			    }
			  }
			})
		}
	},
	
	//点击登录按钮
	loginSubmit() {
		const username = this.data.username;
		const password = this.data.password;
		if (username && password) {
			wx.login({
				success({code}) {
					homeApi.bindingWechat({username, password, code}).then(({openId}) => {
						wx.setStorageSync('openId', openId)
						wx.hideLoading()
						wx.showToast({
							title: '登录成功'
						})
						wx.switchTab({
						  url: '/pages/index/index'
						})
					})
				}
			})
		} else {
			wx.showToast({
				title: '请先输入账号密码',
				icon: 'none'
			})
		}
	},
	//保存输入的账号和密码
	saveUsername({ detail }) {
		this.setData({
			username: detail.value
		})
	},
	savePassword({ detail }) {
		this.setData({
			password: detail.value
		})
	},
  onHide() {
		
  },
	
  onUnload() {
		
  },

  onPullDownRefresh() {
		this.showLoginModel()
  },

  onReachBottom() {
		
  },
		
  onShareAppMessage() {

  }
})