import request from '@/utils/request'

// 查询专家和专家组关系列表
export function listExpertExpertGroup(query) {
  return request({
    url: '/expert/expertExpertGroup/list',
    method: 'get',
    params: query
  })
}

// 查询专家和专家组关系详细
export function getExpertExpertGroup(expertId) {
  return request({
    url: '/expert/expertExpertGroup/' + expertId,
    method: 'get'
  })
}

// 新增专家和专家组关系
export function addExpertExpertGroup(data) {
  return request({
    url: '/expert/expertExpertGroup',
    method: 'post',
    data: data
  })
}

// 修改专家和专家组关系
export function updateExpertExpertGroup(data) {
  return request({
    url: '/expert/expertExpertGroup',
    method: 'put',
    data: data
  })
}

// 删除专家和专家组关系
// export function delExpertExpertGroup(expertId) {
//   return request({
//     url: '/expert/expertExpertGroup/' + expertId,
//     method: 'delete'
//   })
// }

// 删除专家和专家组关系
export function delExpertExpertGroup(query) {
  return request({
    url: '/expert/expertExpertGroup/remove',
    method: 'delete',
    data: query
  })
}

// 导出专家和专家组关系
export function exportExpertExpertGroup(query) {
  return request({
    url: '/expert/expertExpertGroup/export',
    method: 'get',
    params: query
  })
}
