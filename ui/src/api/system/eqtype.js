import request from '@/utils/request'

// 查询岗位列表
export function listType(query) {
  return request({
    url: '/system/equipmentType/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getType(postId) {
  return request({
    url: '/system/equipmentType/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addType(data) {
  return request({
    url: '/system/equipmentType',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateType(data) {
  return request({
    url: '/system/equipmentType',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delType(postId) {
  return request({
    url: '/system/equipmentType/' + postId,
    method: 'delete'
  })
}
