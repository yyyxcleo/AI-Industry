import request from '@/utils/request'

// 查询岗位列表
export function listMaterial(query) {
  return request({
    url: '/system/material/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getMaterial(postId) {
  return request({
    url: '/system/material/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addMaterial(data) {
  return request({
    url: '/system/material',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateMaterial(data) {
  return request({
    url: '/system/material',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delMaterial(postId) {
  return request({
    url: '/system/material/' + postId,
    method: 'delete'
  })
}
