import request from '@/utils/request'

// 模板列表查询
// {type:类型（1：业务模板，2：业务流程）,parentId:父ID（查询流程的时候传模块ID，查询模块的时候传0或者不传）}
export function listTemplateType(data) {
  return request({
    url: '/template/templateType/list',
    method: 'get',
    params: data
  })
}

//新增（parentId:业务模块传0，业务流程传对应业务模块ID）
export function addTemplateType(data) {
  return request({
    url: '/template/templateType',
    method: 'post',
    data: data
  })
}

//修改
export function updateTemplateType(data) {
  return request({
    url: '/template/templateType',
    method: 'put',
    data: data
  })
}

//删除
export function removeTemplateType(ids) {
  return request({
    url: '/template/templateType/' + ids,
    method: 'delete'
  })
}
