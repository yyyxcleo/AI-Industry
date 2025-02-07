import request from '@/utils/request';

export function submitTask(data) {
    return request({
      url: '/submitTask',
      method: 'post',
      data: data,
      baseURL: process.env.VUE_APP_BASE_API_1
    })
  }
  export function getProgress(data,cancel) {

    return request({
      url: '/progress?ptId=' + data,
      method: 'get',
      baseURL: process.env.VUE_APP_BASE_API_1,
      cancelToken: cancel
    })

  }

