const app = getApp()
const profileApi = require('../../../network/profile.js')
const addressApi = require('../../../network/address.js')

Page({
	data: {
		userInfo: {},
		inputValue: '',
		updateFlag: null,
		showTipText: false,
		sexRadioItems: [
			{
				name: '男',
				value: '0',
				checked: 'true'
			},
			{
				name: '女',
				value: '1'
			}
		],
		mainActiveIndex: 0,
		activeId: 0,
		allUnitList: [],
		allPostList: [],
		postIds: []
	},

	onLoad(options) {
		this.setData({
			updateFlag: options.order
		})
		this.setTitle(options.order)
		this.getUserInfo()
	},

	onReady() {

	},

	onShow() {

	},

	//设置顶部标题文字
	setTitle(updateFlag) {
		let titleText = ''
		switch (updateFlag) {
			case '1':
				titleText = '修改姓名';
				break;
			case '2':
				titleText = '修改性别';
				break;
			case '3':
				titleText = '修改手机号码';
				break;
			case '4':
				titleText = '修改邮箱';
				break;
			case '5':
				titleText = '修改座机';
				break;
			case '6':
				titleText = '修改单位';
				break;
			case '7':
				titleText = '修改岗位';
				break;
			default:
				titleText = '修改信息';
				break;
		}
		wx.setNavigationBarTitle({
			title: titleText
		})
	},

	//获取个人信息
	getUserInfo() {
		profileApi.getUserInfo().then(({
			data
		}) => {
			data.avatar = app.globalData.baseUrl + data.avatar
			if (data.sex === '0') {
				this.data.sexRadioItems[0].checked = 'true'
				this.data.sexRadioItems[1].checked = 'false'
			} else {
				this.data.sexRadioItems[0].checked = 'false'
				this.data.sexRadioItems[1].checked = 'true'
			}
			this.setData({
				userInfo: data,
				postIds: data.postIds || []
			})
			if (this.data.updateFlag === '6') {
				this.getAllUnits(data.deptId)
			} else if (this.data.updateFlag === '7'){
				this.getAllPosts()
			}
		})
	},
	
	//获取全部单位
	getAllUnits(deptId) {
		addressApi.getAddressList().then(({data}) => {
			if (data && data.length > 0 && data[0].children && data[0].children.length > 0) {
				const allUnitList = data[0].children
				let navIndex = null
				allUnitList.forEach((item, index) => {
					if (item.children && item.children.length > 0) {
						item.children.forEach((subItem, subIndex) => {
							if (subItem.id === deptId) {
								navIndex = index
							}
						})
					}
				})
				this.setData({
					allUnitList,
					mainActiveIndex: navIndex,
					activeId: deptId
				})
			}
		})
	},
	
	//获取全部的岗位
	getAllPosts() {
		profileApi.getPostList().then(({data}) => {
			this.setData({
				allPostList: data
			})
		})
	},
	
	//input输入框提交事件
	submitInput({
		detail
	}) {
		switch (this.data.updateFlag) {
			case '1':
				this.submitNickname(detail.value)
				break;
			case '2':
				this.submitSex(detail.value)
				break;
			case '3':
				this.submitMobilePhone(detail.value)
				break;
			case '4':
				this.submitEmail(detail.value)
				break;
			case '5':
				this.submitTelephone(detail.value)
				break;
			case '6':
				this.submitUnit(detail)
				break;
			case '7':
				this.setData({
					postIds: detail
				})
				break;
		}
	},

	//姓名提交
	submitNickname(value) {
		const reg = /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/
		if (this.data.userInfo.nickName !== value) {
			if (reg.test(value)) {
				this.setData({
					showTipText: false,
					inputValue: value
				})
			} else {
				this.setData({
					showTipText: true
				})
			}
		}
	},
	
	//性别提交
	submitSex(value) {
		const sexRadioItems = this.data.sexRadioItems
		sexRadioItems.forEach((item, index) => {
			if (value === item.value) {
				sexRadioItems[index].checked = true
			} else {
				sexRadioItems[index].checked = false
			}
		})
		this.setData({
			sexRadioItems,
			inputValue: value
		})
	},
	
	//手机号提交
	submitMobilePhone(value) {
		const reg = /^1[3456789]\d{9}$/;
		if (this.data.userInfo.phonenumber !== value) {
			if (reg.test(value)) {
				this.setData({
					showTipText: false,
					inputValue: value
				})
			} else {
				this.setData({
					showTipText: true
				})
			}
		}
	},
	
	//邮箱提交
	submitEmail(value) {
		const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/;
		if (this.data.userInfo.email !== value) {
			if (reg.test(value)) {
				this.setData({
					showTipText: false,
					inputValue: value
				})
			} else {
				this.setData({
					showTipText: true
				})
			}
		}
	},
	
	//座机提交
	submitTelephone(value) {
		const reg = /^0\d{2,3}-?\d{7,8}$/;
		if (this.data.userInfo.mobile !== value) {
			if (reg.test(value)) {
				this.setData({
					showTipText: false,
					inputValue: value
				})
			} else {
				this.setData({
					showTipText: true
				})
			}
		}
	},
	
	//单位提交
	submitDone() {
		if (!this.data.showTipText) {
			this.confirmSubmit(this.data.updateFlag, this.data.inputValue)
		} else {
			this.setData({
				showTipText: true
			})
		}
	},
	
	//树型选择左侧导航确定
	// onClickNav({ detail = {} }) {
	// 	this.setData({
	// 		mainActiveIndex: detail.index || 0,
	// 	});
	// },
	
	//岗位提交
	// submitPost() {
	// 	this.confirmSubmit('7', JSON.stringify(this.data.postIds))
	// },
	
	//提交api
	confirmSubmit(type, value) {
		profileApi.updateUserInfo({
				type,
				value
			})
			.then(() => {
				wx.navigateBack({
					success() {
						const page = getCurrentPages().pop();
						if (!!page) {
							page.onLoad()
						}
					}
				});
			})
	},

	onHide() {

	},

	onUnload() {

	},

	onPullDownRefresh() {

	},

	onReachBottom() {

	},

	onShareAppMessage() {

	}
})
