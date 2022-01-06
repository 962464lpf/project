import request from '@/utils/request'

// 我的收藏列表
export function listMail(query) {
  return request({
    url: '/system/sysMail/list',
    method: 'get',
    params: query
  })
}

// 取消收藏
export function delMail(ids) {
  return request({
    url: '/system/sysMail/' + ids,
    method: 'delete'
  })
}

// 添加收藏
export function addMail(ids) {
  return request({
    url: '/system/sysMail/add/'+ids,
    method: 'post'
  })
}

// 通讯录列表
export function allList(query) {
  return request({
    url: '/system/sysMail/allList',
    method: 'get',
    params: query
  })
}

// 获取用户信息
export function getUser(id) {
  return request({
    url: '/system/sysMail/getUserInfo/' + id,
    method: 'get'
  })
}
