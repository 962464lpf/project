import request from '@/utils/request'

// 查询专家选拔信息列表
export function listExpertSelectionInfo(query) {
  return request({
    url: '/expert/expertSelectionInfo/list',
    method: 'get',
    params: query
  })
}

// 查询专家选拔信息详细
export function getExpertSelectionInfo(id) {
  return request({
    url: '/expert/expertSelectionInfo/' + id,
    method: 'get'
  })
}

// 新增专家选拔信息
export function addExpertSelectionInfo(data) {
  return request({
    url: '/expert/expertSelectionInfo',
    method: 'post',
    data: data
  })
}

// 修改专家选拔信息
export function updateExpertSelectionInfo(data) {
  return request({
    url: '/expert/expertSelectionInfo',
    method: 'put',
    data: data
  })
}

// 删除专家选拔信息
export function delExpertSelectionInfo(id) {
  return request({
    url: '/expert/expertSelectionInfo/' + id,
    method: 'delete'
  })
}

// 导出专家选拔信息
export function exportExpertSelectionInfo(query) {
  return request({
    url: '/expert/expertSelectionInfo/export',
    method: 'get',
    params: query
  })
}