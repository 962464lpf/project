import request from '@/utils/request'

// 查询项目计划信息列表
export function listProPlanInfo(query) {
  return request({
    url: '/pro/proPlanInfo/list',
    method: 'get',
    params: query
  })
}

// 查询项目计划信息详细
export function getProPlanInfo(id) {
  return request({
    url: '/pro/proPlanInfo/' + id,
    method: 'get'
  })
}

// 新增项目计划信息
export function addProPlanInfo(data) {
  return request({
    url: '/pro/proPlanInfo',
    method: 'post',
    data: data
  })
}

// 修改项目计划信息
export function updateProPlanInfo(data) {
  return request({
    url: '/pro/proPlanInfo',
    method: 'put',
    data: data
  })
}

// 删除项目计划信息
export function delProPlanInfo(id) {
  return request({
    url: '/pro/proPlanInfo/' + id,
    method: 'delete'
  })
}

// 导出项目计划信息
export function exportProPlanInfo(query) {
  return request({
    url: '/pro/proPlanInfo/export',
    method: 'get',
    params: query
  })
}