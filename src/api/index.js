/* 
 要求：能根据接口文档定义接口请求
 包含应用中所有接口函数的模块
 每个函数的返回值都是promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd';

const BASE = ''

// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
// 添加分类                         父级分类的ID        名称
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')
// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')



/* 
1. 获取商品
2. 搜索商品
3.添加商品、更新商品、商品上下架、商品图片上传 
  
*/

// 1.获取商品 /manage/product/list GET 类型
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// 2. 搜索商品 /manage/product/search?pageNum=1&pageSize=5&productName=T  productDesc productName
export const reqProductSearch = ({ pageNum, pageSize, searchType, searchName }) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})
// 根据 id 获取 分类   /manage/category/info Get 
export const CategoryIdName = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

//  http://localhost:5000/manage/product/updateStatus post productId S status N
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 上传图片 http://localhost:5000/manage/img/upload Post image 
export const reqUploadImage = (image) => ajax(BASE + '/manage/img/upload', { image }, 'POST')

// 删除图片 http://localhost:5000/manage/img/delete
export const reqDeleteImage = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加商品  http://localhost:5000/manage/product/add 或者更新商品 http://localhost:5000/manage/product/update POST
export const reqAddorUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 获取角色列表 http://localhost:5000/manage/role/list
export const reqRoleList = () => ajax(BASE + '/manage/role/list')

// 添加角色 http://localhost:5000/manage/role/add POST
export const reqAddRoleName = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

// 更新角色 http://localhost:5000/manage/role/update Post
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')


// 获取用户列表
export const reqUserList = () => ajax(BASE + '/manage/user/list')

// 删除用户 
export const reqDeleteUser = (userId) => ajax(BASE + 'manage/user/delete', { userId } , 'POST')

// 添加用户/ 更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update': 'add'), user, 'POST')

// 请求天气数据
/*
json请求的接口请求函数
 */
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

    jsonp(url, {}, (err, data) => {
      // 成功了
      if (!err && data.status === 'success') {
        let { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else {
        // 失败了
        message.error('获取天气信息失败!')
      }
    })
  })
}
