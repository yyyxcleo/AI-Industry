import request from '@/utils/request'

// 查询岗位列表
export function listMove(query) {
  return request({
    url: '/system/equipmentOperation/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getMove(postId) {
  return request({
    url: '/system/equipmentOperation/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addMove(data) {
  return request({
    url: '/system/equipmentOperation',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateMove(data) {
  return request({
    url: '/system/equipmentOperation',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delMove(postId) {
  return request({
    url: '/system/equipmentOperation/' + postId,
    method: 'delete'
  })
}
