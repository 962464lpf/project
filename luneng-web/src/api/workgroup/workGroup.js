import request from '@/utils/request'

// 查询工作组列表
export function listWorkGroup(query) {
  return request({
    url: '/workgroup/workGroup/list',
    method: 'get',
    params: query
  })
}


// 新增工作组
export function addWorkGroup(data) {
  return request({
    url: '/workgroup/workGroup',
    method: 'post',
    data: data
  })
}

// 修改工作组
export function updateWorkGroup(data) {
  return request({
    url: '/workgroup/workGroup',
    method: 'put',
    data: data
  })
}

// 删除工作组
export function delWorkGroup(id) {
  return request({
    url: '/workgroup/workGroup/' + id,
    method: 'delete'
  })
}

/**
 * 添加用户和工作组关系
 * @param query
 */
export function addBatch(query) {
  return request({
    url: '/workgroup/userWorkGroup/addBatch',
    method: 'post',
    data: query
  })
}

/**
 * 删除用户与工作组关系
 * @param query
 */
export function remove(query) {
  return request({
    url: '/workgroup/userWorkGroup/remove',
    method: 'post',
    data: query
  })
}

// 查询工作组详细
export function getWorkGroup(id) {
  return request({
    url: '/workgroup/workGroup/' + id,
    method: 'get'
  })
}
