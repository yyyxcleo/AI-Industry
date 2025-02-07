import request from '@/utils/request'

// 查询岗位列表
export function listEquipment(query) {
  return request({
    url: '/system/equipment/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getEquipment(postId) {
  return request({
    url: '/system/equipment/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addEquipment(data) {
  return request({
    url: '/system/equipment',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateEquipment(data) {
  return request({
    url: '/system/equipment',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delEquipment(postId) {
  return request({
    url: '/system/equipment/' + postId,
    method: 'delete'
  })
}
