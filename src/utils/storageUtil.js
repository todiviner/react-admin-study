/* 
1.存储local用户信息 
2.用户是否登录 没有就去登录
*/
// import store from 'store'
const USER_KEY = 'user_key'
export default {
  /* 保存用户登录信息 */
  saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    // store.set(USER_KEY, user)
  },
  /* 获取用户登录信息 */
  getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY) || JSON.stringify({}))
    // return store.get(USER_KEY) || {}
  },
  /* 删除用户登录信息 */
  delUser() {
    localStorage.removeItem(USER_KEY)
    // store.remove(USER_KEY)
  }
}