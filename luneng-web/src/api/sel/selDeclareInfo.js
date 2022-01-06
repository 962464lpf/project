import request from '@/utils/request'

// 查询申报信息列表
export function listSelDeclareInfo(query) {
  return request({
    url: '/sel/selDeclareInfo/list',
    method: 'get',
    params: query
  })
}

// 查询申报信息详细
export function getSelDeclareInfo(id) {
  return request({
    url: '/sel/selDeclareInfo/' + id,
    method: 'get'
  })
}

// 新增申报信息
export function addSelDeclareInfo(data) {
  return request({
    url: '/sel/selDeclareInfo',
    method: 'post',
    data: data
  })
}

// 修改申报信息
export function updateSelDeclareInfo(data) {
  return request({
    url: '/sel/selDeclareInfo',
    method: 'put',
    data: data
  })
}

// 删除申报信息
export function delSelDeclareInfo(id) {
  return request({
    url: '/sel/selDeclareInfo/' + id,
    method: 'delete'
  })
}

// 导出申报信息
export function exportSelDeclareInfo(query) {
  return request({
    url: '/sel/selDeclareInfo/export',
    method: 'get',
    params: query
  })
}

// 改变编辑状态
export function changeEditStatus(data) {
  return request({
    url: '/sel/selDeclareInfo/changeEditStatus',
    method: 'post',
    params: data
  })
}

// 查询编辑状态
export function searchEditStatus(data) {
  return request({
    url: '/sel/selDeclareInfo/searchEditStatus',
    method: 'get',
    params: data
  })
}

// 改变评审状态
export function changeDeStatus(data) {
  return request({
    url: '/sel/selDeclareInfo/changeDeclareStatus',
    method: 'post',
    params: data
  })
}

// 提交申报审批
export function submitDeclare(data) {
  return request({
    url: '/sel/selDeclareInfo/submitDeclare',
    method: 'post',
    params: data
  })
}

// 申报审批
export function auditSubmit(data) {
  return request({
    url: '/sel/selDeclareInfo/auditSubmit',
    method: 'post',
    params: data
  })
}


// 查询申报截止时间
export function searchDeclareEndTime(query) {
  return request({
    url: '/sel/selDeclareInfo/searchDeclareEndTime',
    method: 'get',
    params: query
  })
}

// 查询是否可以申报
export function searchDeclarable() {
  return request({
    url: '/sel/selDeclareInfo/searchDeclarable',
    method: 'get'
  })
}


// 更新浏览记录
export function saveUserInfo(id) {
  return request({
    url: '/sel/selDeclareInfo/saveUserInfo/' + id,
    method: 'get'
  })
}

// 查询浏览记录
export function getCountById(id) {
  return request({
    url: '/sel/selDeclareInfo/getCountById/' + id,
    method: 'get'
  })
}

// pdf生成
export function pdfPreview(query) {
  return request({
    url: '/sel/selDeclareInfo/preview',
    method: 'get',
    params: query
  })
}

export function createDownZipFile(query) {
  return request({
    url: '/sel/selDeclareInfo/createDownZipFile',
    method: 'get',
    params: query
  })
}

export function getStatisticalNum(query) {
  return request({
    url: '/sel/selDeclareInfo/getStatisticalNum',
    method: 'get',
    params: query
  })
}
