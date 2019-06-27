import React from 'react'
/* 重定向路由组件 */
import { Redirect, Route, Switch } from 'react-router-dom'


import { Layout } from 'antd'

/* 校验内存中是否有登录的数据 */
import memoryUtil from '../../utils/memoryUtil'
// 导入组件
import Header from '../../components/header/Header'
import LeftNav from '../../components/left-nav/LeftNav'
// 路由管理
import Home from '../home/Home'
import Category from '../category/Category'
import Product from '../product/Product'
import User from '../user/User'
import Role from '../role/Role'
import Bar from '../charts/Bar'
import Line from '../charts/Line'
import Pie from '../charts/Pie'
import Order from '../order/Order'


// UI 组件
const { Footer, Sider, Content } = Layout


/* 后台路由组件 */
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const user = memoryUtil.user
    /* 如果有数据证明已经登录了，没有就去登录 */
    if (!user && !user._id) {
      return <Redirect to='/login' />
      
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header></Header>
          <Content style={{margin: '20px', backgroundColor: '#fff' }}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/user' component={User} />
              <Route path='/role' component={Role} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Route path='/order' component={Order} />
              <Redirect path='/' to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Admin