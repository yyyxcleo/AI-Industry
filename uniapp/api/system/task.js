import request from '@/utils/request'

// 查询岗位列表
export function listProductionTask(query) {
  return request({
    url: '/system/productionTask/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getProductionTask(postId) {
  return request({
    url: '/system/productionTask/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addProductionTask(data) {
  return request({
    url: '/system/productionTask',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateProductionTask(data) {
  return request({
    url: '/system/productionTask',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delProductionTask(postId) {
  return request({
    url: '/system/productionTask/' + postId,
    method: 'delete'
  })
}
