const app = getApp()
const meetingApi = require('../../network/meeting.js')

Page({
  data: {
    params: {
			pageNum: 1,
			pageSize: 8
    },
    meetingList: [],
    timeOut: null
  },

  onLoad (options) {
    this.getMeetingList(this.data.params)
  },

  onReady () {

  },

  onShow () {
    this.getTabBar().init();
  },

  onHide () {

  },

  onUnload() {
		clearTimeout(this.data.timeOut)
  },

  onPullDownRefresh() {
		this.data.params.pageNum = 1
		this.getMeetingList(this.data.params)
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },

  onReachBottom() {
    this.data.params.pageNum = this.data.params.pageNum + 1;
		this.getMeetingList(this.data.params)
  },

  onShareAppMessage() {

  },

  //获取会议列表
	getMeetingList(params) {
		meetingApi.getMeetingList(params).then(({rows}) => {
			if (this.data.params.pageNum > 1) {
				if (rows.length > 0) {
					this.data.meetingList.push(...rows)
					this.setData({
						meetingList: this.data.meetingList
					})
				}
			} else {
				this.setData({
					meetingList: rows
				})
			}
		})
	},

  navDetail({currentTarget: {dataset: {id, index}}}) {
    let url = ''
    if (index === '1' || index === '3') {
      url = `/pages/manageMeeting/meetingDetail/meetingDetail?id=${id}&index=${index}`
    } else if (index === '2') {
      url = `/pages/manageMeeting/meetingRecord/meetingRecord?id=${id}&index=${index}`
    } else if (index === '4') {
      url = `/pages/manageMeeting/manageSignIn/manageSignIn?id=${id}&index=${index}`
    }
    wx.navigateTo({
      url
    })
  }
})