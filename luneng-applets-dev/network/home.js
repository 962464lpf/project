const request = require('./request.js')

//授权登录接口
const bindingWechat = (data) => {
	return request.httpRequest({
		url: '/wechat/login/bindingWechat',
		method: 'GET',
		data: data
	})
}

//获取工作入口的列表
const getMenuList = () => {
	return request.httpRequest({
		url: '/wechat/menu/getMenuList',
		method: 'GET'
	})
}

//获取工作入口的列表
const getWorkList = ({url, data}) => {
	return request.httpRequest({
		url: url,
		method: 'GET',
		data: data
	})
}

//获取工作台账详情
const getMonthReportDetail = (params) => {
	return request.httpRequest({
		url: '/wechat/gzyb/monthReportRecordById',
		method: 'GET',
		data: params
	})
}

module.exports = {
	bindingWechat,
	getMenuList,
	getWorkList,
	getMonthReportDetail
}
