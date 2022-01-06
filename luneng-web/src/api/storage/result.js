import request from '@/utils/request'

// 查询项目储备申报列表
export function listProjectStorageInfo(query) {
  return request({
    url: '/project/projectStorageResult/list',
    method: 'get',
    params: query
  })
}

//导出excel
export function exportExcel(data) {
  return request({
    url: '/project/projectStorageResult/export',
    method: 'get',
    params: data
  })
}
