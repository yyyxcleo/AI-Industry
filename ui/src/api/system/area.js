import request from '@/utils/request'

// 查询岗位列表
export function listArea(query) {
  return request({
    url: '/system/area/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getArea(postId) {
  return request({
    url: '/system/area/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addArea(data) {
  return request({
    url: '/system/area',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateArea(data) {
  return request({
    url: '/system/area',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delArea(postId) {
  return request({
    url: '/system/area/' + postId,
    method: 'delete'
  })
}
