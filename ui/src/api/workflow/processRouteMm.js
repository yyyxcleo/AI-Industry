import request from "@/utils/request";

export function addProcessRoute(data) {
  return request({
    url: '/workflow/processRouteMm',
    method: 'post',
    data: data
  })
}

export function listProcessRoute(query) {
  return request({
    url: '/workflow/processRouteMm/list',
    method: 'get',
    params: query
  })
}

export function getProcessRoute(postId) {
    return request({
      url: '/workflow/processRouteMm/' + postId,
      method: 'get'
    })
  }

export function updateProcessRoute(data) {
  return request({
    url: '/workflow/processRouteMm',
    method: 'put',
    data: data
  })
}

export function delProcessRoute(postId) {
  return request({
    url: '/workflow/processRouteMm/' + postId,
    method: 'delete'
  })
}