import request from '@/utils/request'

// 查询研究内容列表
export function listProPlanTopicContent(query) {
  return request({
    url: '/pro/proPlanTopicContent/list',
    method: 'get',
    params: query
  })
}

// 查询研究内容详细
export function getProPlanTopicContent(id) {
  return request({
    url: '/pro/proPlanTopicContent/' + id,
    method: 'get'
  })
}

// 新增研究内容
export function addProPlanTopicContent(data) {
  return request({
    url: '/pro/proPlanTopicContent',
    method: 'post',
    data: data
  })
}

// 修改研究内容
export function updateProPlanTopicContent(data) {
  return request({
    url: '/pro/proPlanTopicContent',
    method: 'put',
    data: data
  })
}

// 删除研究内容
export function delProPlanTopicContent(id) {
  return request({
    url: '/pro/proPlanTopicContent/' + id,
    method: 'delete'
  })
}

// 导出研究内容
export function exportProPlanTopicContent(query) {
  return request({
    url: '/pro/proPlanTopicContent/export',
    method: 'get',
    params: query
  })
}