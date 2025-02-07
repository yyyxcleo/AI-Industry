import request from '@/utils/request'
export function fetchItem2Data(type){
  return new Promise((resolve) => {
      setTimeout(() => {
          const randomData = Array.from({ length: 4 }, () => Math.floor(Math.random() * 35));
          const barData1 = {
              data:randomData,
              name:['类别1','类别2','类别3','类别4']
          }
          resolve(barData1);
      },0);
  });
  // return request({
  //   url: '/gtBaseData/fireDeviceMessageMysql/currentErrorData',
  //   method: 'get',
  //   params:{
  //     type:type,
  //   },
  // })
}
