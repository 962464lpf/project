import request from '@/utils/request'

// 查询经费预算列表
export function listProPlanFund(query) {
  return request({
    url: '/pro/proPlanFund/list',
    method: 'get',
    params: query
  })
}

// 新增经费预算
export function addProPlanFund(data) {
  return request({
    url: '/pro/proPlanFund',
    method: 'post',
    data: data
  })
}

// 修改经费预算
export function updateProPlanFund(data) {
  return request({
    url: '/pro/proPlanFund',
    method: 'put',
    data: data
  })
}

// 删除经费预算
export function delProPlanFund(id) {
  return request({
    url: '/pro/proPlanFund/' + id,
    method: 'delete'
  })
}

// 导出经费预算
export function exportProPlanFund(query) {
  return request({
    url: '/pro/proPlanFund/export',
    method: 'get',
    params: query
  })
}

//查询项目计划经费
export function getProPlanFund(id) {
  return request({
    url: '/pro/proApprovalInfo/getPlanFund/' + id,
    method: 'get'
  })
}
