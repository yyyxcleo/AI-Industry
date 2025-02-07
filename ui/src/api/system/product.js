import request from '@/utils/request'

// 查询岗位列表
export function listProduct(query) {
  return request({
    url: '/system/product/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getProduct(postId) {
  return request({
    url: '/system/product/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addProduct(data) {
  return request({
    url: '/system/product',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateProduct(data) {
  return request({
    url: '/system/product',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delProduct(postId) {
  return request({
    url: '/system/product/' + postId,
    method: 'delete'
  })
}
