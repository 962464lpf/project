const app = getApp()
const profileApi = require('../../network/profile.js')

Page({
  data: {
		userInfo: {},
		showDialog: false,
		previewImg: '',
		showPopup: false,
		timeOut: null
  },
	
  onLoad(options) {
		this.getUserInfo()
  },
	
  onReady() {

  },

  onShow() {
  	this.getTabBar().init();
  },
	
	//去登录
	navLogin() {
		const openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.redirectTo({
        url: '/pages/login/index',
      })  
    }
	},

	//退出登录
	loginOut() {
		const that = this
		wx.showModal({
			title: '警告',
			content: '您确定要解绑当前微信，并退出登录吗？',
			confirmText: '确定',
			confirmColor: "#07c160",
			cancelText: '取消',
			cancelColor: "#999999",
			success (res) {
				if (res.confirm) {
					profileApi.loginOut().then(() => {
						wx.clearStorageSync('openId')
						that.getUserInfo()
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},

	//获取个人信息
	getUserInfo() {
		profileApi.getUserInfo().then(({data}) => {
			data.avatar = app.globalData.baseUrl + data.avatar
			this.setData({
				userInfo: data
			})
		}).catch(() => {
			this.setData({
				userInfo: {}
			})
		})
	},
	
	//更换头像
	updateAvatar() {
		const that = this
		wx.chooseImage({
		  count: 1,
		  sizeType: ['original', 'compressed'],
		  sourceType: ['album', 'camera'],
		  success (res) {
		    const tempFilePaths = res.tempFilePaths
				that.setData({
					showDialog: true,
					previewImg: tempFilePaths[0]
				})
		  }
		})
	},
	//确定头像确认弹窗
	onConfirm() {
		const that = this
		wx.uploadFile({
			url: app.globalData.baseUrl + app.globalData.uploadAvatar,
			filePath: that.data.previewImg,
			name: 'file',
			formData: {
				openId: wx.getStorageSync('openId')
			},
			success (res) {
				const data = JSON.parse(res.data)
				profileApi.updateUserInfo({
					type: '0',
					value: data.imgUrl
				}).then(() => {
					that.setData({
						showDialog: false
					})
					that.getUserInfo()
				})
			}
		})
	},
	//关闭头像确认弹窗
	onClose() {
		this.setData({
			showDialog: false
		})
	},
	//跳转页面修改其他信息
	navUpdatePage({ currentTarget }) {
		wx.navigateTo({
			url: '/pages/profile/update/index?order=' + currentTarget.dataset.order
		})
	},
  onHide() {

  },
	
  onUnload() {
		clearTimeout(this.data.timeOut)
  },

  onPullDownRefresh() {
		this.getUserInfo()
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },

  onReachBottom() {

  },
	
  onShareAppMessage() {

  }
})