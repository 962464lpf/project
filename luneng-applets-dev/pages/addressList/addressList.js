const app = getApp()
const addressApi = require('../../network/address.js')
const profileApi = require('../../network/profile.js')

Page({
  data: {
		unitId: null,
		unitName: '',
		unitNameTem: '',
		inputUnitName: '',
		showSearchCancel: false,
		memberList: [],
		showPopup: false,
		mainActiveIndex: 0,
		activeId: 0,
		addressList: [],
		timeOut: null
  },
	
  onLoad(options) {
		this.getAddressList()
		this.getUserInfo()
  },
	
  onReady() {

  },

  onShow() {
  	this.getTabBar().init();
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
				unitName: detail
			})
			this.getDeptAddressList('', detail)
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
			unitName: this.data.unitNameTem
		})
		this.getDeptAddressList(this.data.unitId)
	},
	//获取个人信息
	getUserInfo() {
		profileApi.getUserInfo().then(({data}) => {
			this.setData({
				unitNameTem: data.deptName,
				unitName: data.deptName,
				unitId: data.deptId
			})
			this.getDeptAddressList(data.deptId)
		})
	},
	//获取全部通讯录
	getAddressList() {
		addressApi.getAddressList().then(({data}) => {
			if (data && data.length > 0 && data[0].children && data[0].children.length > 0) {
				this.setData({
					addressList: data[0].children
				})
			}
		})
	},
	//获取部门通讯录
	getDeptAddressList(deptId = '', deptName = '') {
		addressApi.getDeptAddressList({deptId, deptName}).then(({rows}) => {
			if (rows) {
				this.setData({
					memberList: rows
				})
			}
		})
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
	//弹出单位选择
	showUnitSelect() {
		this.getTabBar().setData({
			isShowTabbar: false
		})
		this.setData({
			showPopup: true
		})
	},
	//关闭单位选择
	closeUnitSelect() {
		this.setData({
			showPopup: false
		})
		this.getTabBar().setData({
			isShowTabbar: true
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
		const deptArr = this.data.addressList[this.data.mainActiveIndex].children.filter((item) => {
			return item.id === activeId
		})
		this.setData({ 
			activeId, 
			unitName: deptArr[0].text
		});
		this.closeUnitSelect()
		this.getDeptAddressList(this.data.activeId)
	}
})