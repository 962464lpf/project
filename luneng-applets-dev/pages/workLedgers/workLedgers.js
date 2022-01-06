const app = getApp()
const ledgerApi = require('../../network/ledger.js')
Page({
  data: {
		workLedgerList: [],
		params: {
			pageNum: 1,
			pageSize: 8
		},
		timeOut: null,
		moveY: 450,
		movableFlag: false
  },
	
  onLoad(options) {
		this.getCurLedgerList(this.data.params)
  },
	
  onReady() {

  },

  onShow() {
  	this.getTabBar().init();
  },
	
	//获取当前工作台账列表
	getCurLedgerList(params) {
		ledgerApi.getLedgerList(params).then(({rows}) => {
			if (this.data.params.pageNum > 1) {
				if (rows.length > 0) {
					this.data.workLedgerList.push(...rows)
					this.setData({
						workLedgerList: this.data.workLedgerList
					})
				}
			} else {
				this.setData({
					workLedgerList: rows
				})
			}
		})
	},
	
	//新增按钮移动事件
	movableChange({ detail }) {
		const moveY = this.data.moveY
		if (detail.y > moveY) {
			this.setData({
				moveY
			})
		}
	},
	
	//新增台账
	addLedger() {
		wx.navigateTo({
			url: '/pages/workLedgers/updateLedger/updateLedger'
		})
	},
	
	//修改当前台账
	updateLedger({currentTarget}) {
		const id = currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/workLedgers/updateLedger/updateLedger?id=' + id
		})
	},
	
	//删除当前台账
	deleteLedger({currentTarget}) {
		const that = this
		wx.showModal({
		  title: '删除台账',
		  content: '是否确定删除当前台账？',
			confirmText: '删除',
			confirmColor: "#666666",
			cancelText: '取消',
			cancelColor: "#07c160",
		  success (res) {
		    if (res.confirm) {
		      const id = currentTarget.dataset.id
		      const index = currentTarget.dataset.index
					that.data.workLedgerList.splice(index, 1)
		      ledgerApi.deleteLedger({id}).then(() => {
						that.setData({
							workLedgerList: that.data.workLedgerList
						})
		      })
		    } else if (res.cancel) {
					
		    }
		  }
		})
		
	},
	
	//跳转详情
	navDetail({ currentTarget }) {
		const id = currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/workLedgers/detail/detail?id=' + id
		})
	},
	
  onHide() {

  },
	
  onUnload() {
		clearTimeout(this.data.timeOut)
  },

  onPullDownRefresh() {
		this.data.params.pageNum = 1
		this.getCurLedgerList(this.data.params)
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },

  onReachBottom() {
		this.data.params.pageNum = this.data.params.pageNum + 1;
		this.getCurLedgerList(this.data.params)
  },
	//页面滚动距离
	onPageScroll(e) {
		if (e.scrollTop) {
			this.setData({
				moveY: 450 + e.scrollTop
			})
		}
	},
  onShareAppMessage() {

  }
})