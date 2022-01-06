const app = getApp()
const ledgerApi = require('../../../network/ledger.js')

Page({
	data: {
		id: null,
		timeOut: null,
		ledgerForm: {}
	},

	onLoad(options) {
		this.setData({
			id: options.id
		})
		if (options.id) {
			this.getLedgerDetail(options.id)
		}
	},
	
	//获取台账详情
	getLedgerDetail(id) {
		ledgerApi.getLedgerDetail({id}).then(({data}) => {
			this.setData({
				ledgerForm: data
			})
			this.onEditorReady()
		})
	},
	//初始化富文本编辑器
	onEditorReady() {
		const that = this
		wx.createSelectorQuery().select('#editor').context(function(res) {
			that.editorCtx = res.context
			that.initHtml(that.data.ledgerForm.workContent)
		}).exec()
	},
	//初始化html数据
	initHtml(workContent) {
		if (workContent) {
			this.editorCtx.setContents({
			  html: workContent,
			  success: function () {
			    console.log('insert html success')
			  }
			})
		}
	},
	onReady() {
		
	},

	onShow() {

	},
	
	onHide() {

	},

	onUnload() {
		clearTimeout(this.data.timeOut)
	},
	
	onPullDownRefresh() {
		this.getLedgerDetail(this.data.id)
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
	},
	
	onReachBottom() {

	},
	onPageScroll({scrollTop}) {
		
	},
	onShareAppMessage() {

	}
})
