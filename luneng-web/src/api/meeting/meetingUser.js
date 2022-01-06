import request from '@/utils/request'

// 查询参会人员列表
export function listMeetingUser(query) {
  return request({
    url: '/meeting/meetingInfo/getMeetingUserSelectList',
    method: 'get',
    params: query
  })
}

// 查询参会人员列表
export function listAllMeetingUser(query) {
  return request({
    url: '/meeting/meetingInfo/getUserInfoByDeptId',
    method: 'get',
    params: query
  })
}

// 模糊搜索参会人员
export function getUserInfoByName(query) {
  return request({
    url: '/meeting/meetingInfo/getUserInfoByName',
    method: 'get',
    params: query
  })
}

// 查询参会人员详细
export function getMeetingUser(id) {
  return request({
    url: '/meeting/meetingUser/' + id,
    method: 'get'
  })
}

// 新增参会人员
export function addMeetingUser(data) {
  return request({
    url: '/meeting/meetingUser',
    method: 'post',
    data: data
  })
}

// 新增临时参会人员
export function addTemporaryUsers(data) {
  return request({
    url: '/meeting/meetingUser/addTemporaryUsers',
    method: 'post',
    data: data
  })
}

// 修改参会人员
export function updateMeetingUser(data) {
  return request({
    url: '/meeting/meetingUser',
    method: 'put',
    data: data
  })
}

// 删除参会人员
export function delMeetingUser(id) {
  return request({
    url: '/meeting/meetingUser/' + id,
    method: 'delete'
  })
}

// 导出参会人员
export function exportMeetingUser(query) {
  return request({
    url: '/meeting/meetingUser/export',
    method: 'get',
    params: query
  })
}
