import axios from 'axios'
import { message } from 'antd'
/**
 * @param  {请求路径} url
 * @param  {请求参数} data={}
 * @param  {请求类型} type='GET'
 */

 /* 
 能发送异步ajax请求的函数模块
 封装axios库
 函数的返回值是promise对象
 1. 优化：统一处理请求异常
    在外层包一个自己创建的promise对象
    在请求出错时，不reject(error),而是显示错误提示
 */
export default function (url, data = {}, type = 'GET') {

  return new Promise((resolve, reject) => {
    let promise
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data
      })
    } else {  // 请求类型
      promise = axios.post(url, data)
    }
    // 2.如果成功了，调用resolve(value)
    promise.then(response => {
      // 如果成功了,把这个返回给调用者 
      // 拦截了
      resolve(response.data)
    // 3. 如果失败了，不调用reject(error),而是显示错误提示
    }).catch(error => {
      //reject(error)
      // 如果失败了,把这个显示给调用者
      message.error('请求出错了:' + error.message)
    })

  })

}