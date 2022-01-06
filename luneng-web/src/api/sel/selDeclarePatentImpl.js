import request from '@/utils/request'

// 查询专利实施情况列表
export function listSelDeclarePatentImpl(query) {
  return request({
    url: '/sel/selDeclarePatentImpl/list',
    method: 'get',
    params: query
  })
}

// 查询专利实施情况详细
export function getSelDeclarePatentImpl(id) {
  return request({
    url: '/sel/selDeclarePatentImpl/' + id,
    method: 'get'
  })
}

// 新增专利实施情况
export function addSelDeclarePatentImpl(data) {
  return request({
    url: '/sel/selDeclarePatentImpl',
    method: 'post',
    data: data
  })
}

// 修改专利实施情况
export function updateSelDeclarePatentImpl(data) {
  return request({
    url: '/sel/selDeclarePatentImpl',
    method: 'put',
    data: data
  })
}

// 删除专利实施情况
export function delSelDeclarePatentImpl(id) {
  return request({
    url: '/sel/selDeclarePatentImpl/' + id,
    method: 'delete'
  })
}

// 导出专利实施情况
export function exportSelDeclarePatentImpl(query) {
  return request({
    url: '/sel/selDeclarePatentImpl/export',
    method: 'get',
    params: query
  })
}
