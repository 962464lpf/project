// pages/myWorkList/detail/detail.js
const app = getApp()
const homeApi = require('../../../network/home.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    form: {},
    timeOut: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: Number(options.id)
    })
    this.getDetail(this.data.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  
  onUnload() {
		clearTimeout(this.data.timeOut)
	},
	
	onPullDownRefresh() {
		this.getDetail(this.data.id)
		this.data.timeOut = setTimeout(() => {
			wx.stopPullDownRefresh()
		}, 1500)
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getDetail(id) {
    homeApi.getMonthReportDetail({id}).then(({data}) => {
      this.setData({
        form: data
      })
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
})