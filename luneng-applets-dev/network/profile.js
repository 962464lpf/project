const request = require('./request.js')

//获取全部岗位列表
const getPostList = () => {
	return request.httpRequest({
		url: '/wechat/txl/getPostList',
		method: 'GET'
	})
}

//获取个人信息
const getUserInfo = () => {
	return request.httpRequest({
		url: '/wechat/txl/getUserInfo',
		method: 'GET'
	})
}

//修改个人信息
const updateUserInfo = (data) => {
	return request.httpRequest({
		url: '/wechat/txl/updateUserInfo',
		method: 'POST',
		data: data
	})
}

//退出登录
const loginOut = () => {
	return request.httpRequest({
		url: '/wechat/login/unBindingWechat',
		method: 'GET'
	})
}

module.exports = {
	getPostList,
	getUserInfo,
	updateUserInfo,
	loginOut
}