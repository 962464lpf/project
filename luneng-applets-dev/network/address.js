const request = require('./request.js')

//获取通讯录的列表
const getAddressList = () => {
	return request.httpRequest({
		url: '/wechat/txl/getDeptList',
		method: 'GET'
	})
}

//根据部门id查询部门通讯录
const getDeptAddressList = (params) => {
	return request.httpRequest({
		url: '/wechat/txl/getTxlList',
		method: 'GET',
		data: params
	})
}

module.exports = {
	getAddressList,
	getDeptAddressList
}