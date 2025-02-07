import request from "@/utils/request";

export function addProcessRouteDetails(data) {
  return request({
    url: '/workflow/processRouteDd/batch',
    method: 'post',
    data: data
  })
}

export function listProcessRouteDetails(query) {
  return request({
    url: '/workflow/processRouteDd/list',
    method: 'get',
    params: query
  })
}

export function getProcessRouteDetails(postId) {
    return request({
      url: '/workflow/processRouteDd/' + postId,
      method: 'get'
    })
  }

export function updateProcessRouteDetails(data) {
  return request({
    url: '/workflow/processRouteDd',
    method: 'put',
    data: data
  })
}

export function delProcessRouteDetails(postId) {
  return request({
    url: '/workflow/processRouteDd/' + postId,
    method: 'delete'
  })
}
