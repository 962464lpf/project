import request from '@/utils/request'

// 查询绿建基本信息列表
// 参数
// type：1：出过其他认证列表之外的列表，2：其他认证列表（必传）
// projectName：项目名字
// designUnit：设计单位
// level：绿建星级
// attestationTime：计划取得认证时间
// enterUnit：责任单位
// year：年度
// approvalStatus：[1,2,3]  JSON格式的字符串
export function listBuildInfo(query) {
  return request({
    url: '/build/buildInfo/list',
    method: 'get',
    params: query
  })
}

// 查询绿建基本信息详细
export function getBuildInfo(id) {
  return request({
    url: '/build/buildInfo/' + id,
    method: 'get'
  })
}

// 新增绿建基本信息
export function addBuildInfo(data) {
  return request({
    url: '/build/buildInfo',
    method: 'post',
    data: data
  })
}

// 修改绿建基本信息
export function updateBuildInfo(data) {
  return request({
    url: '/build/buildInfo',
    method: 'put',
    data: data
  })
}

// 删除绿建基本信息
export function delBuildInfo(id) {
  return request({
    url: '/build/buildInfo/' + id,
    method: 'delete'
  })
}

// 操作 参数格式{operation:"1",infoId:"1"} operation 1：点击编制绿建认证目标建议书；
// 2：审核同意；3：审核退回；4：提醒上传签字版扫描件；5：归档滑块
export function operation(query) {
  return request({
    url: '/build/buildInfo/operation',
    method: 'get',
    params: query
  })
}

//获取绿建认证目标建议书
export function getAdviseInfo(infoId) {
  return request({
    url: '/build/buildInfo/getAdviseInfo/' + infoId,
    method: 'get'
  })
}

//修改绿建认证目标建议书
//参数格式{type:'1',buildInfo:"获取详情返回的"} type=1提交type=2保存草稿
export function updateAdviseInfo(adviseInfo) {
  return request({
    url: '/build/buildInfo/updateAdviseInfo',
    method: 'put',
    data: adviseInfo
  })
}

// 删除绿建认证目标建议书
export function deleteAdviseInfo(infoId) {
  return request({
    url: '/build/buildInfo/deleteAdviseInfo/' + infoId,
    method: 'delete'
  })
}

//
// 获取操作日志
// 参数格式{infoId:1,type:1}
// query infoId:绿建ID type:日志类型（1：操作日志，2：审核历史）
//
export function getOperLog(query) {
  return request({
    url: '/build/buildOperLog/list',
    method: 'get',
    params: query
  })
}

/**
 * 打包
 * @param data
 */
export function createZip(data) {
  return request({
    url: '/build/buildInfo/createDownZipFile',
    method: 'get',
    params: data
  })
}

// 批量归档
export function buildEnd(ids) {
  return request({
    url: '/build/buildInfo/buildEnd/' + ids,
    method: 'get'
  })
}

// 其他认证新增
export function addOther(data) {
  return request({
    url: '/build/buildInfo/addOther',
    method: 'post',
    data: data
  })
}

// 其他认证删除
export function removeOther(ids) {
  return request({
    url: '/build/buildInfo/removeOther/' + ids,
    method: 'delete'
  })
}

// 其他认证修改
export function updateOther(data) {
  return request({
    url: '/build/buildInfo/updateOther',
    method: 'put',
    data: data
  })
}

// pdf预览
export function preview(infoId) {
  return request({
    url: '/build/buildInfo/preview/' + infoId,
    method: 'get'
  })
}
