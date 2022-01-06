const app = getApp()
const homeApi = require('../../network/home.js')

Page({
  data: {
		params: {},
		typeName: '',
		releaseFlag: '',
		workList: [],
		timeOut: null
  },
	
  onLoad(options) {
		const paramsTem = JSON.parse(decodeURIComponent(options.params))
		paramsTem.data.pageNum = 1
		paramsTem.data.pageSize = 8
		this.setData({
			params: paramsTem
		})
		wx.setNavigationBarTitle({
			title: paramsTem.typename
		})
		this.getCurWorkList(paramsTem)
  },
	
  onReady() {

  },

  onShow() {
		
  },

	//获取当前工作类型列表
	getCurWorkList(params) {
		homeApi.getWorkList(params).then(({rows}) => {
			if (this.data.params.data.pageNum > 1) {
				if (rows.length > 0) {
					this.data.workList.push(...rows)
					this.setData({
						workList: this.data.workList
					})
				}
			} else {
				this.setData({
					workList: rows
				})
			}
		})
	},

	//跳转详情
	navDetail({currentTarget: {dataset: {id, flag}}}) {
		if (flag && flag === 1) {
			wx.navigateTo({
				url: '/pages/myWorkList/detail/detail?id=' + id
			})
		}
	},

  onHide() {

  },
	
  onUnload() {
		clearTimeout(this.data.timeOut)
		// const pages = getCurrentPages();
		// const page = pages[pages.length - 2];
		// page.onLoad()
  },

  onPullDownRefresh() {
		this.data.params.data.pageNum = 1
		this.getCurWorkList(this.data.params)
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },

  onReachBottom() {
		this.data.params.data.pageNum = this.data.params.data.pageNum + 1;
		this.getCurWorkList(this.data.params)
  },
	
  onShareAppMessage() {

  }
})