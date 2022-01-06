
import request from '@/utils/request'

// 文件下载
export function downloadFile(query) {
  return request({
    url: '/common/download/resource',
    method: 'get',
    params: query,
    headers: {
      isToken: false
    }
  })
}