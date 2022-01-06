const app = getApp()
const homeApi = require('../../network/home.js')
Page({
  data: {
		workMenus: [],
		timeOut: null
  },
	
  onLoad(options) {
		if (wx.getStorageSync('openId')) this.getCurMenuList()
  },
	
  onReady() {
		
  },

  onShow() {
  	this.getTabBar().init();
  },
	
	//点击入口进入工作列表
	navWorkList({ currentTarget }) {
		const params = {
			url: currentTarget.dataset.url,
			data: { 
				releaseFlag: currentTarget.dataset.status
			},
			typename:  currentTarget.dataset.typetitle
		}
		const paramsTem = encodeURIComponent(JSON.stringify(params))
		wx.navigateTo({
			url: '/pages/myWorkList/myWorkList?params=' + paramsTem
		})
	},
	//获取当前工作菜单列表
	getCurMenuList() {
		homeApi.getMenuList().then(({data}) => {
			this.setData({
				workMenus: data
			})
		})
	},
  onHide() {

  },
	
  onUnload() {

  },

  onPullDownRefresh() {
		this.getCurMenuList()
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },

  onReachBottom() {

  },
	
  onShareAppMessage() {

  }
})