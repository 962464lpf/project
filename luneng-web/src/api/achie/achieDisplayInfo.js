import request from '@/utils/request'

// 查询成果展示列表
export function listAchieDisplayInfo(query) {
  return request({
    url: '/achie/achieDisplayInfo/list',
    method: 'get',
    params: query
  })
}

// 查询成果展示详细
export function getAchieDisplayInfo(id) {
  return request({
    url: '/achie/achieDisplayInfo/' + id,
    method: 'get'
  })
}

// 新增成果展示
export function addAchieDisplayInfo(data) {
  return request({
    url: '/achie/achieDisplayInfo',
    method: 'post',
    data: data
  })
}

// 修改成果展示
export function updateAchieDisplayInfo(data) {
  return request({
    url: '/achie/achieDisplayInfo',
    method: 'put',
    data: data
  })
}

// 删除成果展示
export function delAchieDisplayInfo(id) {
  return request({
    url: '/achie/achieDisplayInfo/' + id,
    method: 'delete'
  })
}

// 导出成果展示
export function exportAchieDisplayInfo(query) {
  return request({
    url: '/achie/achieDisplayInfo/export',
    method: 'get',
    params: query
  })
}

// 自动添加成果展示  data: {certificateCode(证书编号),businessLinkman(联系人)，businessTel（联系电话），businessEmail（联系邮箱）}
export function autoAddAchieDisplayInfo(data) {
  return request({
    url: '/achie/achieDisplayInfo/autoAdd',
    method: 'post',
    data: data
  })
}

// 根据证书编号查询公司名称
export function getUnitByCertCode(code) {
  return request({
    url: '/achie/achieDisplayInfo/getUnitByCertCode',
    method: 'get',
    params:{'code':code}
  })
}

export function publish(data) {
  return request({
    url: '/achie/achieDisplayInfo/publish',
    method: 'post',
    data: data
  })
}
