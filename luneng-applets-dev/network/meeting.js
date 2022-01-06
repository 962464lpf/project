const request = require('./request.js')

//获取会议的列表
const getMeetingList = (params) => {
	return request.httpRequest({
		url: '/wechat/meeting/getMeetingList',
		method: 'GET',
		data: params
	})
}

//获取会议详情
const getMeetingInfoById = (params) => {
	return request.httpRequest({
		url: '/wechat/meeting/getMeetingInfoById',
		method: 'GET',
		data: params
	})
}

//保存会议记录
const saveMeetingRecord = (data) => {
	return request.httpRequest({
		url: '/wechat/meeting/saveMeetingRecord',
		method: 'POST',
		data: data
	})
}

//获取参会人员的列表
const getMeetingUserList = (params) => {
	return request.httpRequest({
		url: '/wechat/meeting/getMeetingUserList',
		method: 'GET',
		data: params
	})
}

//签到或取消签到
const signOrCancel = (data) => {
	return request.httpRequest({
		url: '/wechat/meeting/signOrCancel',
		method: 'POST',
		data: data
	})
}

//获取部门列表
const getDeptList = (params) => {
	return request.httpRequest({
		url: '/wechat/meeting/getDeptList',
		method: 'GET',
		data: params
	})
}

//获取用户列表
const getUserList = (params) => {
	return request.httpRequest({
		url: '/wechat/meeting/getUserList',
		method: 'GET',
		data: params
	})
}

//添加临时人员
const addTemporaryUsers = (data) => {
	return request.httpRequest({
		url: '/wechat/meeting/addTemporaryUsers',
		method: 'POST',
		data: data
	})
}

//删除临时人员
const cancelTemporaryUsers = (data) => {
	return request.httpRequest({
		url: '/wechat/meeting/cancelTemporaryUsers',
		method: 'POST',
		data: data
	})
}

module.exports = {
	getMeetingList,
	getMeetingInfoById,
	saveMeetingRecord,
	getMeetingUserList,
	signOrCancel,
	getDeptList,
	getUserList,
	addTemporaryUsers,
	cancelTemporaryUsers
}
