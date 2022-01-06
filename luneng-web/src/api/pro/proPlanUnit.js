import request from '@/utils/request'

// 查询联系方式列表
export function listProPlanUnit(query) {
  return request({
    url: '/pro/proPlanUnit/list',
    method: 'get',
    params: query
  })
}

// 查询联系方式详细
export function getProPlanUnit(id) {
  return request({
    url: '/pro/proPlanUnit/' + id,
    method: 'get'
  })
}

// 新增联系方式
export function addProPlanUnit(data) {
  return request({
    url: '/pro/proPlanUnit',
    method: 'post',
    data: data
  })
}

// 修改联系方式
export function updateProPlanUnit(data) {
  return request({
    url: '/pro/proPlanUnit',
    method: 'put',
    data: data
  })
}

// 删除联系方式
export function delProPlanUnit(id) {
  return request({
    url: '/pro/proPlanUnit/' + id,
    method: 'delete'
  })
}

// 导出联系方式
export function exportProPlanUnit(query) {
  return request({
    url: '/pro/proPlanUnit/export',
    method: 'get',
    params: query
  })
}