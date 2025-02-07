import request from "@/utils/request";

export function addEquipmentTaskbatch(data) {
  return request({
    url: '/system/equipmentTask/batch',
    method: 'post',
    data: data
  })
}

export function addEquipmentTask(data) {
    return request({
      url: '/system/equipmentTask',
      method: 'post',
      data: data
    })
  }

export function listEquipmentTask(query) {
  return request({
    url: '/system/equipmentTask/list',
    method: 'get',
    params: query
  })
}

export function updateEquipmentTask(data) {
  return request({
    url: '/system/equipmentTask',
    method: 'put',
    data: data
  })
}

export function delEquipmentTask(postId) {
  return request({
    url: '/system/equipmentTask/' + postId,
    method: 'delete'
  })
}

export function getEquipmentTask(postId) {
    return request({
      url: '/system/equipmentTask/' + postId,
      method: 'get'
    })
  }

export function checkEquipmentTaskStatus(ptId) {
  return request({
    url: '/system/equipmentTask/check/' + ptId,
    method: 'get'
  })
}

