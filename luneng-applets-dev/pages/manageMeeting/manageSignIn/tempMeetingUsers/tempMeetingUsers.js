const app = getApp()
const meetingApi = require('../../../../network/meeting.js')
const profileApi = require('../../../../network/profile.js')

Page({
  data: {
		meetingId: null,
		userInfo: {},
		deptList: [],
		deptId: null,
		deptName: '',
		userList: [],
		deptNameTem: '',
		inputUnitName: '',
		showSearchCancel: false,
		showPopup: false,
		mainActiveIndex: 0,
		activeId: 0,
		timeOut: null
  },
	
  onLoad(options) {
		this.setData({
			meetingId: options.id
		})
		this.getDeptList()
		this.getUserInfo()
  },
	
  onReady() {

  },

  onShow() {

	},

  onHide() {

  },
	
  onUnload() {

  },

  onPullDownRefresh() {
		this.getDeptAddressList(this.data.activeId)
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },

  onReachBottom() {

  },
	
  onShareAppMessage() {

	},

	//获取个人信息
	getUserInfo() {
		profileApi.getUserInfo().then(({data}) => {
			this.setData({
				userInfo: data,
				deptId: data.deptId,
				deptName: data.deptName,
				deptNameTem: data.deptName
			})
			this.getDeptUserList(data.deptId, data.deptName)
		}).catch(() => {
			this.setData({
				userInfo: {}
			})
		})
	},

	//获取部门列表
	getDeptList() {
		meetingApi.getDeptList().then(({data}) => {
			if (data && data.length > 0 && data[0].children && data[0].children.length > 0) {
				this.setData({
					deptList: data[0].children
				})
			}
		})
	},

	//获取部门用户列表
	getDeptUserList(deptId = null, deptName = '') {
		const meetingId = this.data.meetingId
		meetingApi.getUserList({meetingId, deptId, deptName}).then(({data}) => {
			this.setData({
				userList: data
			})
		})
	},

	//添加，取消添加
	handleAdd({currentTarget: {dataset: {id, ifadd, index}}}) {
		const meetingId = this.data.meetingId
		let data = {
			userId: id,
			meetingId,
			ifAdd: !ifadd
		}
		meetingApi.addTemporaryUsers(data).then(() => {
			const idx = parseInt(index)
			const ifAdd = `userList[${idx}].ifAdd`
			this.setData({
				[ifAdd]: !ifadd
			})
			wx.showToast({
				title: `${ifadd ? '已取消添加' : '添加成功'}`,
				icon: 'none',
				duration: 1000
			})
		})
	},

	//搜索框聚焦时
	onFocus() {
		this.setData({
			showSearchCancel: true
		})
	},

	//点击搜索
	onSearch({ detail }) {
		if (detail) {
			this.setData({
				deptName: detail
			})
			this.getDeptUserList(null, detail)
		} else {
			wx.showToast({
			  title: '您还没有输入单位名称哦',
				icon: "none",
			  duration: 2000
			})
		}
	},

	//取消搜索
	onCancel() {
		this.setData({
			showSearchCancel: false,
			deptName: this.data.deptNameTem
		})
		this.getDeptUserList(this.data.deptId)
	},

	//弹出单位选择
	showUnitSelect() {
		this.setData({
			showPopup: true
		})
	},

	//关闭单位选择
	closeUnitSelect() {
		this.setData({
			showPopup: false
		})
	},

	//树型选择左侧导航确定
	onClickNav({ detail = {} }) {
		this.setData({
			mainActiveIndex: detail.index || 0,
		});
	},
	//树型选择item确定
	onClickItem({ detail = {} }) {
		const activeId = this.data.activeId === detail.id ? null : detail.id;
		const deptArr = this.data.deptList[this.data.mainActiveIndex].children.filter((item) => {
			return item.id === activeId
		})
		this.setData({ 
			activeId, 
			deptName: deptArr[0].text
		});
		this.closeUnitSelect()
		this.getDeptUserList(this.data.activeId)
	}
})