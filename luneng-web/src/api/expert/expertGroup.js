import request from '@/utils/request'

// 查询专家组列表
export function listExpertGroup(query) {
  return request({
    url: '/expert/expertGroup/list',
    method: 'get',
    params: query
  })
}

//评审项目选择专家列表
export function selExpertGroup() {
  return request({
    url: '/expert/expertGroup/selectExpertGroup',
    method: 'get'
  })
}

// 查询专家组详细
export function getExpertGroup(id) {
  return request({
    url: '/expert/expertGroup/' + id,
    method: 'get'
  })
}

// 新增专家组
export function addExpertGroup(data) {
  return request({
    url: '/expert/expertGroup',
    method: 'post',
    data: data
  })
}

// 修改专家组
export function updateExpertGroup(data) {
  return request({
    url: '/expert/expertGroup',
    method: 'put',
    data: data
  })
}

// 修改专家组状态
export function changeExpertGroupStatus(id, status) {
  const dataTem = {
    id,
    status
  }
  return request({
    url: '/expert/expertGroup',
    method: 'put',
    data: dataTem
  })
}

// 删除专家组
export function delExpertGroup(id) {
  return request({
    url: '/expert/expertGroup/' + id,
    method: 'delete'
  })
}

// 复制专家组
export function copyExpertGroup(id) {
  return request({
    url: '/expert/expertGroup/copy/' + id,
    method: 'get'
  })
}

// 导出专家组
export function exportExpertGroup(query) {
  return request({
    url: '/expert/expertGroup/export',
    method: 'get',
    params: query
  })
}

//查看当前专家组可选和已选的专家
export function queryAllExperts(query) {
  return request({
    url: '/expert/expert/getNotSelectExpert',
    method: 'get',
    params: query
  })
}

//查看所有的专家组
export function queryAllExpertGroup(query) {
  return request({
    url: '/expert/expertGroup/listAll',
    method: 'get',
    params: query
  })
}

//当前组添加成员
export function addCurrGoupMember(query) {
  return request({
    url: 'expert/expertExpertGroup/addBatch',
    method: 'post',
    data: query
  })
}

