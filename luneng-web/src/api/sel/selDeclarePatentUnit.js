import request from '@/utils/request'

// 查询实施单位实施情况列表
export function listSelDeclarePatentUnit(query) {
  return request({
    url: '/sel/selDeclarePatentUnit/list',
    method: 'get',
    params: query
  })
}

// 查询实施单位实施情况详细
export function getSelDeclarePatentUnit(id) {
  return request({
    url: '/sel/selDeclarePatentUnit/' + id,
    method: 'get'
  })
}

// 新增实施单位实施情况
export function addSelDeclarePatentUnit(data) {
  return request({
    url: '/sel/selDeclarePatentUnit',
    method: 'post',
    data: data
  })
}

// 修改实施单位实施情况
export function updateSelDeclarePatentUnit(data) {
  return request({
    url: '/sel/selDeclarePatentUnit',
    method: 'put',
    data: data
  })
}

// 删除实施单位实施情况
export function delSelDeclarePatentUnit(id) {
  return request({
    url: '/sel/selDeclarePatentUnit/' + id,
    method: 'delete'
  })
}

// 导出实施单位实施情况
export function exportSelDeclarePatentUnit(query) {
  return request({
    url: '/sel/selDeclarePatentUnit/export',
    method: 'get',
    params: query
  })
}
