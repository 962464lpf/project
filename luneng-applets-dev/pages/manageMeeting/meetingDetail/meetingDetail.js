const app = getApp()
const meetingApi = require('../../../network/meeting.js')

Page({
  data: {
    type: '',
    meetingInfo: {}
  },

  onLoad (options) {
    this.setData({
      type: options.index
    })
    const id = parseInt(options.id)
    this.getMeetingDetail(id)
  },

  onReady () {

  },

  onShow () {

  },

  onHide () {

  },

  onUnload () {

  },

  onPullDownRefresh () {

  },

  onReachBottom () {

  },

  onShareAppMessage () {

  },

  //获取会议详情
	getMeetingDetail(id) {
		meetingApi.getMeetingInfoById({id}).then(({data}) => {
			this.setData({
				meetingInfo: data
      })
      let html = ''
      if (this.data.type === '1') html = this.data.meetingInfo.meetingAgenda;
      if (this.data.type === '3') html = this.data.meetingInfo.meetingMinutes;
      this.onEditorReady(html)
    })
  },
  
  //初始化富文本编辑器
	onEditorReady(html) {
		const that = this
		wx.createSelectorQuery().select('#editor').context(function(res) {
			that.editorCtx = res.context
			that.initHtml(html)
		}).exec()
  },
  //初始化html数据
	initHtml(html) {
		if (html) {
			this.editorCtx.setContents({
			  html: html,
			  success: function () {
			    console.log('insert html success')
			  }
			})
		}
	}
})