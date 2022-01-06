import request from '@/utils/request'

// 查询项目储备申报列表
export function listProjectStorageInfo(query) {
  return request({
    url: '/project/projectStorageInfo/list',
    method: 'get',
    params: query
  })
}

// 查询项目储备申报详细
export function getProjectStorageInfo(id) {
  return request({
    url: '/project/projectStorageInfo/' + id,
    method: 'get'
  })
}

// 新增项目储备申报
export function addProjectStorageInfo(data) {
  return request({
    url: '/project/projectStorageInfo',
    method: 'post',
    data: data
  })
}

// 修改项目储备申报
export function updateProjectStorageInfo(data) {
  return request({
    url: '/project/projectStorageInfo',
    method: 'put',
    data: data
  })
}

// 删除项目储备申报
export function delProjectStorageInfo(id) {
  return request({
    url: '/project/projectStorageInfo/' + id,
    method: 'delete'
  })
}

export function updateStatus(data) {
  return request({
    url: '/project/projectStorageInfo/updateStatus',
    method: 'post',
    data: data
  })
}

export function operation(data) {
  return request({
    url: '/project/projectStorageInfo/operation',
    method: 'post',
    data: data
  })
}

export function storagePreview(data) {
  return request({
    url: '/project/projectStorageInfo/preview',
    method: 'get',
    params: data
  })
}

export function storageDownWord(data) {
  return request({
    url: '/project/projectStorageInfo/downWord',
    method: 'get',
    params: data
  })
}

export function getProjectNoticeSend() {
  return request({
    url: '/project/projectStorageInfo/getProjectNoticeSend',
    method: 'get'
  })
}

export function downloadTemp() {
  return request({
    url: '/project/projectStorageInfo/downloadTemp',
    method: 'get',
    responseType: 'blob'
  })
}
