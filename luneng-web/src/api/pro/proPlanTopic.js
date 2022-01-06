import request from '@/utils/request'

// 查询研究课题列表
export function listProPlanTopic(query) {
  return request({
    url: '/pro/proPlanTopic/list',
    method: 'get',
    params: query
  })
}

// 查询研究课题详细
export function getProPlanTopic(id) {
  return request({
    url: '/pro/proPlanTopic/' + id,
    method: 'get'
  })
}

// 新增研究课题
export function addProPlanTopic(data) {
  return request({
    url: '/pro/proPlanTopic',
    method: 'post',
    data: data
  })
}

// 修改研究课题
export function updateProPlanTopic(data) {
  return request({
    url: '/pro/proPlanTopic',
    method: 'put',
    data: data
  })
}

// 删除研究课题
export function delProPlanTopic(id) {
  return request({
    url: '/pro/proPlanTopic/' + id,
    method: 'delete'
  })
}

// 导出研究课题
export function exportProPlanTopic(query) {
  return request({
    url: '/pro/proPlanTopic/export',
    method: 'get',
    params: query
  })
}