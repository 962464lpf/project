import request from '@/utils/request'

// 历史文件新增
export function saveBiddingFilesHis(query) {
  return request({
    url: '/pro/proBiddingFilesHis',
    method: 'post',
    data: query
  })
}

export function listBiddingFilesHis(query) {
  return request({
    url: '/pro/proBiddingFilesHis/list',
    method: 'get',
    params: query
  })
}
