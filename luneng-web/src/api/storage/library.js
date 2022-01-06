import request from '@/utils/request'

// 查询项目储备库列表
export function listProjectStorageInfo(query) {
  return request({
    url: '/project/storageLibrary/list',
    method: 'get',
    params: query
  })
}

export function exportExcel(data) {
  return request({
    url: '/project/storageLibrary/export',
    method: 'get',
    params: data
  })
}

// 新增项目储备申报
export function addProjectStorageInfo(data) {
  return request({
    url: '/project/storageLibrary',
    method: 'post',
    data: data
  })
}
