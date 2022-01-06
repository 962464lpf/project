import request from '@/utils/request'

// 查询文件信息列表列表
// fileType：文件类型
//文件类型
//1：绿建工作组会签表，2：预评估报告，3：成本分析报告，
//4：绿建得分卡，5：绿建评价任务书，6：绿建审核报告，
//7：绿建设计预评估意见书，8：其他资料，9：绿建材料设备技术规格书，
//10：批复意见，13：星级认证证书，14：合同文件技术部分，
//15：计划书，16：设计文件，17：相关报告，
//18：申报电子版，19：会议纪要，20：证件扫描标识，
//21：运营阶段的绿色要点及要求，22：绿建认证目标建议书（签字版），23，其他认证附件
//24：批量下载打包文件，25：绿建认证目标建议书（原始版）
//history：是否为历史文件 0：否，1：是；infoId：绿建基本信息ID
export function listBuildFile(query) {
  return request({
    url: '/build/buildFile/list',
    method: 'get',
    params: query
  })
}


// 新增文件信息
export function addBuildInfo(data) {
  return request({
    url: '/build/buildFile',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteFile(ids) {
  return request({
    url: '/build/buildFile/' + ids,
    method: 'delete',
  })
}

