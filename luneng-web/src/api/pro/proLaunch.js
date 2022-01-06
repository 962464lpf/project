import request from "@/utils/request";

//查询项目启动列表
export function proInfoStartList(query) {
  return request({
    url: '/pro/proApprovalInfo/startList',
    method: 'get',
    params: query
  })
}

// 上传ppt
export function uploadLaunchPpt(data) {
  return request({
    url: '/pro/proApprovalInfo/uploadPpt',
    method: 'post',
    data: data
  })
}

// 上传会议纪要
export function uploadLaunchMeetingFile(data) {
  return request({
    url: '/pro/proApprovalInfo/uploadMeetingFile',
    method: 'post',
    data: data
  })
}

// 初始化启动实施计划
export function initLaunchPlayPlan(id) {
  return request({
    url: '/pro/proApprovalInfo/initPlayPlan',
    method: 'post',
    data: id
  })
}

//编辑编制计划
export function updateLaunchPlayPlan(data) {
  return request({
    url: '/pro/proApprovalInfo/updatePlayPlan',
    method: 'post',
    data: data
  })
}

// 申报单位查询编辑实施计划
export function selectPlayPlanDeclare(id) {
  return request({
    url: '/pro/proApprovalInfo/selectPlayPlan/' + id,
    method: 'get'
  })
}

// 科信部查询实施计划修改申请
export function selectPlayPlanKXB(id) {
  return request({
    url: '/pro/proApprovalInfo/selectPlayPlanKxb/' + id,
    method: 'get'
  })
}

// 查询实施计划详情
export function selectPlayPlanDetail(id) {
  return request({
    url: '/pro/proApprovalInfo/selectPlayPlanDetail/' + id,
    method: 'get'
  })
}

// 科信部审核启动实施计划
export function auditLaunchPlayPlan(data) {
  return request({
    url: '/pro/proApprovalInfo/auditPlayPlan',
    method: 'put',
    data: data
  })
}

// 申报单位催办
export function urgingPlayPlan(id) {
  return request({
    url: '/pro/proApprovalInfo/urgingPlayPlan/' + id,
    method: 'post'
  })
}
