const app = getApp()
const meetingApi = require('../../../network/meeting.js')

Page({

  data: {
    params: {
			meetingId: null
    },
    meetingUserList: [],
    tempMeetingUserList: [],
    timeOut: null
  },

  onLoad (options) {
    const params = {
      meetingId: parseInt(options.id)
    }
    this.setData({
      params
    })
  },

  onReady () {

  },

  onShow () {
    this.getMeetingUserList(this.data.params)
  },

  onHide () {

  },

  onUnload () {
    clearTimeout(this.data.timeOut)
  },

  onPullDownRefresh () {
    this.getMeetingUserList(this.data.params)
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },

  onReachBottom () {

  },

  onShareAppMessage () {

  },

  //处理签到
  handleSignIn({currentTarget: {dataset: {type, id, status, index}}}) {
    let data = {
      id
    }
    if (status === 1) {
      data.signinStatus = 0
    } else {
      data.signinStatus = 1
    }
    meetingApi.signOrCancel(data).then(() => {
      const idx = parseInt(index)
      let signStatus = ''
      if (type === '1') signStatus = `meetingUserList[${idx}].signStatus`
      if (type === '2') signStatus = `tempMeetingUserList[${idx}].signStatus`
      this.setData({
        [signStatus]: status === 1 ? 0 : 1
      })
      wx.showToast({
        title: `${status === 1 ? '已取消签到' : '签到成功'}`,
        icon: 'none',
        duration: 1000
      })
    })
  },

  //移除临时人员
  deletePerson({currentTarget: {dataset: {id, index}}}) {
    const idx = parseInt(index)
    meetingApi.cancelTemporaryUsers({id}).then(() => {
      const {tempMeetingUserList} = this.data
      tempMeetingUserList.splice(idx, 1)
      this.setData({
        tempMeetingUserList
      })
		})
  },

  //跳转添加临时页面
  navUserList() {
    const meetingId = this.data.params.meetingId
    wx.navigateTo({
      url: '/pages/manageMeeting/manageSignIn/tempMeetingUsers/tempMeetingUsers?id=' + meetingId
    })
  },

  //获取参会人员列表
	getMeetingUserList(params) {
		meetingApi.getMeetingUserList(params).then(({data}) => {
      this.setData({
        meetingUserList: data.users1,
        tempMeetingUserList: data.users2
      })
		})
	}
})