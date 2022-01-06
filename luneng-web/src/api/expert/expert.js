import request from '@/utils/request'

// 查询专家列表
export function listExpert(query) {
  return request({
    url: '/expert/expert/list',
    method: 'get',
    params: query
  })
}

// 查询专家详细
export function getExpert(id) {
  return request({
    url: '/expert/expert/' + id,
    method: 'get'
  })
}

// 新增专家
export function addExpert(data) {
  return request({
    url: '/expert/expert',
    method: 'post',
    data: data
  })
}

//模糊查询专家登录账户
export function queryExpertUserName() {
  return request({
    url: '/expert/expert/getNotSelectUser',
    method: 'get'
  })
}

// 修改专家
export function updateExpert(data) {
  return request({
    url: '/expert/expert',
    method: 'put',
    data: data
  })
}

// 修改专家状态
export function changeExpertStatus(id, status) {
  const dataTem = {
    id,
    status
  }
  return request({
    url: '/expert/expert',
    method: 'put',
    data: dataTem
  })
}

// 删除专家
export function delExpert(id) {
  return request({
    url: '/expert/expert/' + id,
    method: 'delete'
  })
}

// 导出专家
export function exportExpert(query) {
  return request({
    url: '/expert/expert/export',
    method: 'get',
    params: query
  })
}

export function importTemplate() {
  return request({
    url: '/expert/expert/importTemplate',
    method: 'get'
  })
}

export function getReviewExpertList(query) {
  return request({
    url: 'expert/expert/getReviewExpertList',
    method: 'get',
    params: query
  })
}
