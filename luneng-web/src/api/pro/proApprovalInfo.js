import request from '@/utils/request'

// 选择储备项目信息列表
export function selProApprovalInfo(query) {
  return request({
    url: '/pro/proApprovalInfo/getStorageInfoList',
    method: 'get',
    params: query
  })
}

// 查询项目立项信息列表
export function listProApprovalInfo(query) {
  return request({
    url: '/pro/proApprovalInfo/list',
    method: 'get',
    params: query
  })
}

// 查询项目立项信息详细
export function getProApprovalInfo(id) {
  return request({
    url: '/pro/proApprovalInfo/' + id,
    method: 'get'
  })
}

// 新增项目立项信息
export function addProApprovalInfo(data) {
  return request({
    url: '/pro/proApprovalInfo',
    method: 'post',
    data: data
  })
}

// 修改项目立项信息
export function updateProApprovalInfo(data) {
  return request({
    url: '/pro/proApprovalInfo',
    method: 'put',
    data: data
  })
}

// 启动项目立项信息
export function startApprovalPro(id) {
  return request({
    url: '/pro/proApprovalInfo/startApprovalPro/' + id,
    method: 'post'
  })
}

// 删除项目立项信息
export function delProApprovalInfo(ids) {
  return request({
    url: '/pro/proApprovalInfo/deleteEstablishmentPlan/' + ids,
    method: 'delete'
  })
}

//保存立项项目
export function saveProApprovalInfo(ids) {
  return request({
    url: '/pro/proApprovalInfo/saveApprovalInfos/' + ids,
    method: 'post'
  })
}

//移至储备库
export function moveStorageInfo(ids) {
  return request({
    url: '/pro/proApprovalInfo/moveApprovalInfos/' + ids,
    method: 'post'
  })
}

// 导出项目立项信息
export function exportProApprovalInfo(query) {
  return request({
    url: '/pro/proApprovalInfo/export',
    method: 'get',
    params: query
  })
}

// 查询编制计划信息列表
export function listPlayPlanInfo(query) {
  return request({
    url: '/pro/proApprovalInfo/planInfoList',
    method: 'get',
    params: query
  })
}

//选择编制项目
export function listUnPrepareProApprovalInfo() {
  return request({
    url: '/pro/proApprovalInfo/unprepareProOptions',
    method: 'get'
  })
}

// 导出编制计划项目信息
export function exportPlanInfo(query) {
  return request({
    url: '/pro/proApprovalInfo/exportPlanInfo',
    method: 'get',
    params: query
  })
}

//初始化编制计划
export function initEstablishmentPlan(id) {
  return request({
    url: '/pro/proApprovalInfo/initEstablishmentPlan',
    method: 'post',
    data: id
  })
}

//查询编制计划详情
export function selectEstablishmentPlanById(id) {
  return request({
    url: '/pro/proApprovalInfo/selectEstablishmentPlanById/' + id,
    method: 'get'
  })
}

//实时保存编制计划
export function updateEstablishmentPlan(data) {
  return request({
    url: '/pro/proApprovalInfo/updateEstablishmentPlan',
    method: 'post',
    data: data
  })
}

//保存日志操作
export function saveProOptLog(data) {
  return request({
    url: '/pro/proOperLog',
    method: 'post',
    data: data
  })
}

// 修改编制计划状态
export function updatePlanAuditStatus(data) {
  return request({
    url: '/pro/proApprovalInfo/updatePlanAuditStatus',
    method: 'post',
    data: data
  })
}

//撤回编制计划
export function reBackPlanInfo(data) {
  return request({
    url: '/pro/proApprovalInfo/reBackPlanInfo',
    method: 'post',
    data: data
  })
}

//作废编制计划
export function invalidPlanInfo(data) {
  return request({
    url: '/pro/proApprovalInfo/invalidPlanInfo',
    method: 'post',
    data: data
  })
}

//审核页面确认修改备份
export function backupApprovalInfo(id) {
  return request({
    url: '/pro/proApprovalInfo/backupApprovalInfo/' + id,
    method: 'post'
  })
}

//删除招采文件
export function deleteZcFile(data) {
  return request({
    url: '/pro/proApprovalInfo/deleteZcFile',
    method: 'post',
    data: data
  })
}

//预览下载任务书
export function downLoadPreviewPlan(data) {
  return request({
    url: '/pro/proPlanInfo/preview',
    method: 'get',
    params: data
  })
}

// 验证项目编码是否重复
export function validProjectCode(data) {
  return request({
    url: '/pro/proApprovalInfo/validProjectCode',
    method: 'get',
    params: data
  })
}
