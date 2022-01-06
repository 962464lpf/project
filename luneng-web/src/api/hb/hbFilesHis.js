import request from '@/utils/request'

// 查询环保项目历史文件列表
export function listHbFilesHis(query) {
  return request({
    url: '/hb/hbFilesHis/list',
    method: 'get',
    params: query
  })
}

// 查询环保项目历史文件详细
export function getHbFilesHis(id) {
  return request({
    url: '/hb/hbFilesHis/' + id,
    method: 'get'
  })
}

// 新增环保项目历史文件
export function addHbFilesHis(data) {
  return request({
    url: '/hb/hbFilesHis',
    method: 'post',
    data: data
  })
}

// 修改环保项目历史文件
export function updateHbFilesHis(data) {
  return request({
    url: '/hb/hbFilesHis',
    method: 'put',
    data: data
  })
}

// 删除环保项目历史文件
export function delHbFilesHis(id) {
  return request({
    url: '/hb/hbFilesHis/' + id,
    method: 'delete'
  })
}

// 导出环保项目历史文件
export function exportHbFilesHis(query) {
  return request({
    url: '/hb/hbFilesHis/export',
    method: 'get',
    params: query
  })
}

