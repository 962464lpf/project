const request = require('./request.js')

//获取工作台账的列表
const getLedgerList = (params) => {
	return request.httpRequest({
		url: '/wechat/gztz/getGztzList',
		method: 'GET',
		data: params
	})
}

//获取工作台账详情
const getLedgerDetail = (params) => {
	return request.httpRequest({
		url: '/wechat/gztz/getWorkAccountById',
		method: 'GET',
		data: params
	})
}
//保存工作台账
const saveWorkLedger = (data) => {
	return request.httpRequest({
		url: '/wechat/gztz/saveWorkAccount',
		method: 'POST',
		data: data
	})
}

//删除工作台账
const deleteLedger = (data) => {
	return request.httpRequest({
		url: '/wechat/gztz/removeAccount',
		method: 'POST',
		data: data
	})
}

module.exports = {
	getLedgerList,
	getLedgerDetail,
	saveWorkLedger,
	deleteLedger
}