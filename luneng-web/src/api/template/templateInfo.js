import request from '@/utils/request'

// 模板列表查询
// {pageSize:10,pageNum:1,businessModelName:'业务模块',businessFlowName:'业务流程',fileName:'模板文件名'}
export function listTemplateInfo(data) {
  return request({
    url: '/template/templateInfo/list',
    method: 'get',
    params: data
  })
}

export function getTemplateInfo(id) {
  return request({
    url: '/template/templateInfo/' + id,
    method: 'get'
  })
}

//新增
export function addTemplateInfo(data) {
  return request({
    url: '/template/templateInfo',
    method: 'post',
    data: data
  })
}

//修改
export function updateTemplateInfo(data) {
  return request({
    url: '/template/templateInfo',
    method: 'put',
    data: data
  })
}

//删除
export function removeTemplateInfo(ids) {
  return request({
    url: '/template/templateInfo/' + ids,
    method: 'delete'
  })
}
