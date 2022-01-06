import request from '@/utils/request'

// 查询研究人员列表
export function listProPlanPerson(query) {
  return request({
    url: '/pro/proPlanPerson/list',
    method: 'get',
    params: query
  })
}

// 查询研究人员详细
export function getProPlanPerson(id) {
  return request({
    url: '/pro/proPlanPerson/' + id,
    method: 'get'
  })
}

// 新增研究人员
export function addProPlanPerson(data) {
  return request({
    url: '/pro/proPlanPerson',
    method: 'post',
    data: data
  })
}

// 修改研究人员
export function updateProPlanPerson(data) {
  return request({
    url: '/pro/proPlanPerson',
    method: 'put',
    data: data
  })
}

// 删除研究人员
export function delProPlanPerson(id) {
  return request({
    url: '/pro/proPlanPerson/' + id,
    method: 'delete'
  })
}

// 导出研究人员
export function exportProPlanPerson(query) {
  return request({
    url: '/pro/proPlanPerson/export',
    method: 'get',
    params: query
  })
}