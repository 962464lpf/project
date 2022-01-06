import request from '@/utils/request'

// 查询国外申请专利情况列表
export function listSelDeclarePatentForiegn(query) {
  return request({
    url: '/system/selDeclarePatentForiegn/list',
    method: 'get',
    params: query
  })
}

// 查询国外申请专利情况详细
export function getSelDeclarePatentForiegn(id) {
  return request({
    url: '/system/selDeclarePatentForiegn/' + id,
    method: 'get'
  })
}

// 新增国外申请专利情况
export function addSelDeclarePatentForiegn(data) {
  return request({
    url: '/system/selDeclarePatentForiegn',
    method: 'post',
    data: data
  })
}

// 修改国外申请专利情况
export function updateSelDeclarePatentForiegn(data) {
  return request({
    url: '/system/selDeclarePatentForiegn',
    method: 'put',
    data: data
  })
}

// 删除国外申请专利情况
export function delSelDeclarePatentForiegn(id) {
  return request({
    url: '/system/selDeclarePatentForiegn/' + id,
    method: 'delete'
  })
}

// 导出国外申请专利情况
export function exportSelDeclarePatentForiegn(query) {
  return request({
    url: '/system/selDeclarePatentForiegn/export',
    method: 'get',
    params: query
  })
}