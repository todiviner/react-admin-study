import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import memoryUtil from './utils/memoryUtil'
import storageUtil from './utils/storageUtil'
/*
思考：
1. 获取到local存储的用户信息  如果没有跳转到登录页面登录 然后存储用户信息
2. 把用户信息存储到内存中
3. 内存中有用户信息了 其他判断都可以正常执行了
4. 如果local存储信息移除了，就会跳转回登录页面
*/
const localUser = storageUtil.getUser()
memoryUtil.user = localUser

// import 'antd/dist/antd.css'
ReactDOM.render(<App />, document.getElementById('root'));
