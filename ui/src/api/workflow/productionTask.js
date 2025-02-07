import request from "@/utils/request";

export function addProductionTaskbatch(data) {
  return request({
    url: '/system/productionTask/batch',
    method: 'post',
    data: data
  })
}

export function addProductionTask(data) {
    return request({
      url: '/system/productionTask',
      method: 'post',
      data: data
    })
  }

export function listProductionTask(query) {
  return request({
    url: '/system/productionTask/list',
    method: 'get',
    params: query
  })
}

export function updateProductionTask(data) {
  return request({
    url: '/system/productionTask',
    method: 'put',
    data: data
  })
}

export function delProductionTask(postId) {
  return request({
    url: '/system/productionTask/' + postId,
    method: 'delete'
  })
}

export function getProductionTask(postId) {
    return request({
      url: '/system/productionTask/' + postId,
      method: 'get'
    })
  }
