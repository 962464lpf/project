const app = getApp()
const meetingApi = require('../../../network/meeting.js')

Page({
  data: {
    type: '',
    id: null,
    meetingInfo: {},
    isReadOnly: true,
    meetingRecord: ''
  },

  onLoad (options) {
    const id = parseInt(options.id)
    this.getMeetingDetail(id)
    this.setData({
      type: options.index,
      id
    })
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

  //修改
  updateRecord() {
    const {isReadOnly} = this.data
    if (isReadOnly) {
      this.setData({
        isReadOnly: false
      })
    } else {
      this.saveMeetingRecord()
    }
  },

  //获取会议详情
	getMeetingDetail(id) {
		meetingApi.getMeetingInfoById({id}).then(({data}) => {
			this.setData({
        meetingInfo: data
      })
      this.onEditorReady(data.meetingRecord)
    })
  },

  //编辑器失去焦点时获取输入内容
	editorBlur({ detail }) {
		if (detail.html !== '<p><br></p>') {
			this.setData({
				meetingRecord: detail.html
			})
		} else {
			wx.showToast({
				title: '会议记录不能为空',
				icon: 'none'
			})
		}
  },
  
  //保存提交会议记录
  saveMeetingRecord() {
    meetingApi.saveMeetingRecord({
      id: this.data.id,
      meetingRecord: this.data.meetingRecord
    }).then(() => {
      this.setData({
				isReadOnly: true
			})
      this.getMeetingDetail(this.data.id);
      wx.showToast({
				title: '保存成功',
				icon: 'none'
			})
    })
  },
  
  //初始化富文本编辑器
	onEditorReady(meetingRecord) {
		const that = this
		wx.createSelectorQuery().select('#editor').context(function(res) {
			that.editorCtx = res.context
			that.initHtml(meetingRecord)
		}).exec()
  },

  //初始化html数据
	initHtml(meetingRecord) {
		if (meetingRecord) {
			this.editorCtx.setContents({
			  html: meetingRecord,
			  success: function () {
			    console.log('insert html success')
			  }
			})
		}
	}
})