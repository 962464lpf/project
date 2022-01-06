import request from '@/utils/request'

// 研究成果列表
export function listResult(query) {
  return request({
    url: '/conclude/researchResult/list',
    method: 'get',
    params: query
  })
}

// 项目结题列表
export function concludeList(query) {
  return request({
    url: '/conclude/researchResult/concludeList',
    method: 'get',
    params: query
  })
}

// 结题审核列表
export function auditList(query) {
  return request({
    url: '/conclude/researchResult/auditList',
    method: 'get',
    params: query
  })
}

// 项目验收列表
export function checkList(query) {
  return request({
    url: '/conclude/researchResult/checkList',
    method: 'get',
    params: query
  })
}

// 操作
export function operation(data) {
  return request({
    url: '/conclude/researchResult/operation',
    method: 'post',
    data: data
  })
}

// 根据infoId获取申请结题详情
export function getConcludeInfoByInfoId(infoId) {
  return request({
    url: '/conclude/researchResult/getConcludeInfoByInfoId/' + infoId,
    method: 'get'
  })
}

// 修改结题申请详情
export function updateConcludeInfo(data) {
  return request({
    url: '/conclude/researchResult/updateConcludeInfo',
    method: 'put',
    data: data
  })
}

// 获取操作日志
export function getLogList(data) {
  return request({
    url: '/conclude/researchResult/logList',
    method: 'get',
    params: data
  })
}

// 预览
export function concludePreview(data) {
  return request({
    url: '/conclude/researchResult/preview',
    method: 'get',
    params: data
  })
}

// 获取审批
export function getAuditOpinions(infoId) {
  return request({
    url: '/conclude/researchResult/getAuditOpinions/' + infoId,
    method: 'get'
  })
}

// 获取历史文件
export function getHistoryFile(data) {
  return request({
    url: '/conclude/researchResult/getFileHisList',
    method: 'get',
    params: data
  })
}
