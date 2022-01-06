const app = getApp()
const ledgerApi = require('../../../network/ledger.js')

Page({
	data: {
		id: null,
		showPopup: false,
		currentDate: '',
		openTimeType: '',
		ledgerForm: {
			accountTitle: '',
			workType: '',
			workBeginDate: '',
			workEndDate: '',
			workAddress: '',
			workContent: '',
			publishStatus: 0
		},
		validates: [{
				showTipText: true
			},
			{
				showTipText: true
			},
			{
				showTipText: true
			},
			{
				showTipText: true
			},
			{
				showTipText: true
			}
		],
		showTipText1: false,
		showTipText2: false,
		showTipText3: false,
		showTipText4: false,
		//富文本
		formats: {},
		readOnly: false,
		placeholder: '请输入工作内容',
		isIOS: false,
		toolbarTop: 0
	},

	onLoad(options) {
		if (options.id) {
			this.setData({
				id: options.id
			})
			this.getLedgerDetail(options.id)
		}
	},
	
	//获取台账详情
	getLedgerDetail(id) {
		ledgerApi.getLedgerDetail({id}).then(({data}) => {
			data.openId = wx.getStorageSync('openId')
			this.setData({
				ledgerForm: data,
				validates: [{
						showTipText: false
					},
					{
						showTipText: false
					},
					{
						showTipText: false
					},
					{
						showTipText: false
					},
					{
						showTipText: false
					}
				],
			})
			this.onEditorReady()
		})
	},
	
	onReady() {
		wx.createSelectorQuery().select('#toolbar').boundingClientRect((rect) => {
			this.setData({
				toolbarTop: rect.top
			})
		}).exec()
	},

	onShow() {

	},

	//保存台账标题输入
	submitInput1({
		detail
	}) {
		const accountTitle = 'ledgerForm.accountTitle'
		const showTipText = 'validates[0].showTipText'
		if (detail.value) {
			this.setData({
				[accountTitle]: detail.value,
				showTipText1: false,
				[showTipText]: false
			})
		} else {
			this.setData({
				showTipText1: true,
				[showTipText]: true
			})
		}
	},

	//保存工作类型输入
	submitInput2({
		detail
	}) {
		const workType = 'ledgerForm.workType'
		const showTipText = 'validates[1].showTipText'
		if (detail.value) {
			this.setData({
				[workType]: detail.value,
				showTipText2: false,
				[showTipText]: false
			})
		} else {
			this.setData({
				showTipText2: true,
				[showTipText]: true
			})
		}
	},
	
	//保存相关地点输入
	submitInput3({
		detail
	}) {
		const workAddress = 'ledgerForm.workAddress'
		this.setData({
			[workAddress]: detail.value
		})
	},

	//打开时间选择器
	openTimePicker({
		currentTarget
	}) {
		this.setData({
			showPopup: true,
			openTimeType: currentTarget.dataset.order
		})
	},

	//确定时间
	confirmTime({
		detail
	}) {
		const time = new Date(detail)
		const y = time.getFullYear()
		const m = time.getMonth() + 1
		const d = time.getDate()
		const date = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
		if (this.data.openTimeType === '1') {
			if (this.data.ledgerForm.workEndDate) {
				const endDate = new Date(this.data.ledgerForm.workEndDate).getTime()
				const workBeginDate = "ledgerForm.workBeginDate"
				const showTipText = 'validates[2].showTipText'
				if (detail < endDate) {
					this.setData({
						showPopup: false,
						[workBeginDate]: date,
						showTipText3: false,
						[showTipText]: false
					})
				} else {
					this.setData({
						showPopup: false,
						[workBeginDate]: '',
						showTipText3: true,
						[showTipText]: true
					})
					wx.showToast({
						title: '开始时间必须小于结束时间',
						icon: 'none'
					})
				}
			} else {
				const workBeginDate = "ledgerForm.workBeginDate"
				const showTipText = 'validates[2].showTipText'
				this.setData({
					showPopup: false,
					[workBeginDate]: date,
					showTipText3: false,
					[showTipText]: false
				})
			}
		} else if (this.data.openTimeType === '2') {
			if (this.data.ledgerForm.workBeginDate) {
				const beginDate = new Date(this.data.ledgerForm.workBeginDate).getTime()
				const workEndDate = "ledgerForm.workEndDate"
				const showTipText = 'validates[3].showTipText'
				if (detail > beginDate) {
					this.setData({
						showPopup: false,
						[workEndDate]: date,
						showTipText4: false,
						[showTipText]: false
					})
				} else {
					this.setData({
						showPopup: false,
						[workEndDate]: '',
						showTipText4: true,
						[showTipText]: true
					})
					wx.showToast({
						title: '结束时间必须大于开始时间',
						icon: 'none'
					})
				}
			} else {
				const workEndDate = "ledgerForm.workEndDate"
				const showTipText = 'validates[3].showTipText'
				this.setData({
					showPopup: false,
					[workEndDate]: date,
					showTipText4: false,
					[showTipText]: false
				})
			}
		}
	},
	//关闭时间选择器
	closeTimeSelect() {
		if (this.data.openTimeType === '1') {
			const showTipText = 'validates[2].showTipText'
			this.setData({
				showPopup: false,
				showTipText3: true,
				[showTipText]: true
			})
		} else if (this.data.openTimeType === '2') {
			const showTipText = 'validates[3].showTipText'
			this.setData({
				showPopup: false,
				showTipText4: true,
				[showTipText]: true
			})
		}
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
	//编辑器失去焦点时获取输入内容
	editorBlur({ detail }) {
		const showTipText = 'validates[4].showTipText'
		if (detail.html !== '<p><br></p>') {
			const workContent = "ledgerForm.workContent"
			this.setData({
				[workContent]: detail.html,
				[showTipText]: false
			})
		} else {
			wx.showToast({
				title: '工作内容不能为空',
				icon: 'none'
			})
			this.setData({
				[showTipText]: true
			})
		}
	},
	//工具栏选中样式
	format(e) {
		let {
			name,
			value
		} = e.target.dataset
		if (!name) return
		this.editorCtx.format(name, value)
	},
	onStatusChange(e) {
		const formats = e.detail
		this.setData({
			formats
		})
	},
	//富文本清除
	clear() {
		this.editorCtx.clear({
			success: function(res) {
				console.log("clear success")
			}
		})
	},
	//富文本插入图片
	insertImage() {
		const that = this
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				const tempFilePaths = res.tempFilePaths
				wx.uploadFile({
					url: app.globalData.baseUrl + app.globalData.uploadApi,
					filePath: tempFilePaths[0],
					name: 'file',
					formData: {
						openId: wx.getStorageSync('openId')
					},
					success(res) {
						const data = JSON.parse(res.data)
						that.editorCtx.insertImage({
							src: app.globalData.baseUrl + data.imgUrl,
							width: '80%',
							success() {
								console.log('insert image success')
							}
						})
					}
				})
			}
		})
	},
	//保存提交
	saveSubmit() {
		const validate = this.data.validates.every(item => {
			return item.showTipText === false
		})
		if (validate) {
			this.data.ledgerForm.publishStatus = 0
			ledgerApi.saveWorkLedger(this.data.ledgerForm).then(() => {
				wx.switchTab({
					url: '/pages/workLedgers/workLedgers',
					success() {
						const page = getCurrentPages().pop();
						if (!!page) {
							page.onLoad()
						}
					}
				})
			})
		} else {
			wx.showToast({
				title: '您还有未填的表单信息哟',
				icon: 'none'
			})
		}
	},
	//完成提交
	doneSubmit() {
		const validate = this.data.validates.every(item => {
			return item.showTipText === false
		})
		if (validate) {
			this.data.ledgerForm.publishStatus = 1
			ledgerApi.saveWorkLedger(this.data.ledgerForm).then(() => {
				wx.switchTab({
					url: '/pages/workLedgers/workLedgers',
					success() {
						const page = getCurrentPages().pop();
						if (!!page) {
							page.onLoad()
						}
					}
				})
			})
		} else {
			wx.showToast({
				title: '您还有未填的表单信息哟',
				icon: 'none'
			})
		}
	},
	onHide() {

	},

	onUnload() {

	},

	onPullDownRefresh() {

	},
	onReachBottom() {

	},
	onPageScroll({scrollTop}) {
		if (scrollTop >= this.data.toolbarTop) {
			this.setData({
				stickyClass: 'position: fixed; left: 0; top: 0; right: 0; z-index: 99; background-color: #fff;'
			})
		} else {
			this.setData({
				stickyClass: ''
			})
		}
	},
	onShareAppMessage() {

	}
})
