import request from '@/utils/request'

// 查询会议信息列表
export function listMeetingInfo(query) {
  return request({
    url: '/meeting/meetingInfo/list',
    method: 'get',
    params: query
  })
}

// 查询相关项目列表
export function getProjectOptions() {
  return request({
    url: '/meeting/meetingInfo/getProjectOptions',
    method: 'get'
  })
}

// 查询会议信息详细
export function getMeetingInfo(id) {
  return request({
    url: '/meeting/meetingInfo/' + id,
    method: 'get'
  })
}

// 新增会议信息
export function addMeetingInfo(data) {
  return request({
    url: '/meeting/meetingInfo',
    method: 'post',
    data: data
  })
}

// 修改会议信息
export function updateMeetingInfo(data) {
  return request({
    url: '/meeting/meetingInfo',
    method: 'put',
    data: data
  })
}

//获取通知回执列表
export function getNoticeReceiptList(query) {
  return request({
    url: '/meeting/meetingUser/getNoticeReceiptList',
    method: 'get',
    params: query
  })
}

//获取会议签到列表
export function getSignUserList(query) {
  return request({
    url: '/meeting/meetingUser/getSignUserList',
    method: 'get',
    params: query
  })
}

//参会人员保存回执消息
export function saveNoticeReceipt(data) {
  return request({
    url: '/meeting/meetingUser/saveReceipt',
    method: 'post',
    data: data
  })
}

//参会人员查询回执消息
export function getNoticeReceipt(query) {
  return request({
    url: '/meeting/meetingUser/getNoticeReceipt',
    method: 'get',
    params: query
  })
}

//保存会议记录
export function saveMeetingRecord(data) {
  return request({
    url: '/meeting/meetingInfo/saveMeetingRecord',
    method: 'post',
    data: data
  })
}

//结束会议
export function finishMeeting(data) {
  return request({
    url: '/meeting/meetingInfo/finishMeeting',
    method: 'post',
    data: data
  })
}

//发布会议纪要
export function saveMeetingMinutes(data) {
  return request({
    url: '/meeting/meetingInfo/saveMeetingMinutes',
    method: 'post',
    data: data
  })
}

//结束会议
export function archiveMeeting(data) {
  return request({
    url: '/meeting/meetingInfo/archiveMeeting',
    method: 'post',
    data: data
  })
}

//改变会议状态 id,status(0未开始，1进行中，2已结束)
export function changeMeetingStatus(data) {
  return request({
    url: '/meeting/meetingInfo/changeStatus',
    method: 'post',
    data: data
  })
}

//参数：id(会议id),type(类型：1会议议程预览，2会议纪要预览)，get请求
//会议pdf预览
export function meetingPreview(query) {
  return request({
    url: '/meeting/meetingInfo/preview',
    method: 'get',
    params: query
  })
}

// 删除会议信息
export function delMeetingInfo(id) {
  return request({
    url: '/meeting/meetingInfo/' + id,
    method: 'delete'
  })
}

// 导出会议信息
export function exportMeetingInfo(query) {
  return request({
    url: '/meeting/meetingInfo/export',
    method: 'get',
    params: query
  })
}
