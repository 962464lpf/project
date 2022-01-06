import request from '@/utils/request'

// 查询主要知识产权证明目录列表
export function listSelDeclareScienceProve(query) {
  return request({
    url: '/sel/selDeclareScienceProve/list',
    method: 'get',
    params: query
  })
}

// 查询主要知识产权证明目录详细
export function getSelDeclareScienceProve(id) {
  return request({
    url: '/sel/selDeclareScienceProve/' + id,
    method: 'get'
  })
}

// 新增主要知识产权证明目录
export function addSelDeclareScienceProve(data) {
  return request({
    url: '/sel/selDeclareScienceProve',
    method: 'post',
    data: data
  })
}

// 修改主要知识产权证明目录
export function updateSelDeclareScienceProve(data) {
  return request({
    url: '/sel/selDeclareScienceProve',
    method: 'put',
    data: data
  })
}

// 删除主要知识产权证明目录
export function delSelDeclareScienceProve(id) {
  return request({
    url: '/sel/selDeclareScienceProve/' + id,
    method: 'delete'
  })
}

// 导出主要知识产权证明目录
export function exportSelDeclareScienceProve(query) {
  return request({
    url: '/sel/selDeclareScienceProve/export',
    method: 'get',
    params: query
  })
}