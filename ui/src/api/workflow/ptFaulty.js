import request from "@/utils/request";

export function addPtFaultyBatch(data) {
  return request({
    url: '/system/ptFaulty/batch',
    method: 'post',
    data: data
  })
}

export function addPtFaulty(data) {
    return request({
      url: '/system/ptFaulty',
      method: 'post',
      data: data
    })
}

export function listPtFaulty(query) {
  return request({
    url: '/system/ptFaulty/list',
    method: 'get',
    params: query
  })
}

export function updatePtFaulty(data) {
  return request({
    url: '/system/ptFaulty',
    method: 'put',
    data: data
  })
}

export function delPtFaulty(postId) {
  return request({
    url: '/system/ptFaulty/' + postId,
    method: 'delete'
  })
}

export function getPtFaulty(postId) {
    return request({
      url: '/system/ptFaulty/' + postId,
      method: 'get'
    })
}
