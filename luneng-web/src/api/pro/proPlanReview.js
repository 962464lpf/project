import request from "@/utils/request";

//显示已读/未读
export function saveProApprovalInfoRead(data) {
  return request({
    url: '/pro/proUserInfo',
    method: 'post',
    data: data
  })
}

//编制计划数量统计
export function selectPlanInfoCount() {
  return request({
    url: '/pro/proPlanInfo/selectPlanInfoCount',
    method: 'get'
  })
}

//审核计划
export function auditPlanInfo(data) {
  return request({
    url: '/pro/proPlanInfo/auditPlanInfo',
    method: 'put',
    data: data
  })
}

//获取计划书预览
export function planPreview() {
  return request({
    url: '/pro/proPlanInfo/preview',
    method: 'get'
  })
}

// 查询审核计划信息详细
export function getProAuditInfo(id) {
  return request({
    url: '/pro/proApprovalInfo/getAuditInfoById/' + id,
    method: 'get'
  })
}

// 查询审核计划信息详细
export function listProOperLog(query) {
  return request({
    url: '/pro/proOperLog/list',
    method: 'get',
    params: query
  })
}

