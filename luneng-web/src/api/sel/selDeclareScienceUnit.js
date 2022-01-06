import request from '@/utils/request'

// 查询主要完成单位情况列表
export function listSelDeclareScienceUnit(query) {
  return request({
    url: '/sel/selDeclareScienceUnit/list',
    method: 'get',
    params: query
  })
}

// 查询主要完成单位情况详细
export function getSelDeclareScienceUnit(id) {
  return request({
    url: '/sel/selDeclareScienceUnit/' + id,
    method: 'get'
  })
}

// 新增主要完成单位情况
export function addSelDeclareScienceUnit(data) {
  return request({
    url: '/sel/selDeclareScienceUnit',
    method: 'post',
    data: data
  })
}

// 修改主要完成单位情况
export function updateSelDeclareScienceUnit(data) {
  return request({
    url: '/sel/selDeclareScienceUnit',
    method: 'put',
    data: data
  })
}

// 删除主要完成单位情况
export function delSelDeclareScienceUnit(id) {
  return request({
    url: '/sel/selDeclareScienceUnit/' + id,
    method: 'delete'
  })
}

// 导出主要完成单位情况
export function exportSelDeclareScienceUnit(query) {
  return request({
    url: '/sel/selDeclareScienceUnit/export',
    method: 'get',
    params: query
  })
}