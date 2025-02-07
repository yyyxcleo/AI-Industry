import request from '@/utils/request'

// 查询岗位列表
export function listTask(query) {
  return request({
    url: '/system/equipmentTask/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getTask(postId) {
  return request({
    url: '/system/equipmentTask/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addTask(data) {
  return request({
    url: '/system/equipmentTask',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateTask(data) {
  return request({
    url: '/system/equipmentTask',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delTask(postId) {
  return request({
    url: '/system/equipmentTask/' + postId,
    method: 'delete'
  })
}
