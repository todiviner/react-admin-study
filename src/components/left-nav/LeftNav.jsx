import React from 'react'

import { Link, withRouter } from 'react-router-dom'

import './LeftNav.less'

import logo from '../../assets/images/logo.png'

import { Menu, Icon } from 'antd'

import menuList from '../../config/menuConfig'
import storageUtil from '../../utils/storageUtil';

const { SubMenu } = Menu

class LeftNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: ''
    }
  }

  // 根据 menu数组生成对应的 标签数组
  // 使用 map + 递归调用
  /*getMenuNodes_map = (menuList) => {
    // 根据 路径 查找 是否 有赋值 
    let path = this.props.location.pathname
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        // 初始展开的 SubMenu 菜单项 key 数组
        let cItem = item.children.find(citem => citem.key === path)
        // 是否有找到
        if (cItem) {
          this.setState({
            key: item.key
          })
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }

    })
  }*/

  /* 根据权限 登录不同的页面 */
  hasAuth = (item) => {
    /* 获取对应的 权限 路径信息 */
    const { key, isPublic } = item
    const user = storageUtil.getUser()
    const username = user.username
    const menus = user.role.menus
    /* 
      1. 如果是 admin 顶级账号直接登录
      2. 如果用户什么权限都没有就有一个公开的页面 isPublic
      3. 当前用户有item的权限：key中有没有menu
    */

    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
      // 强制转换布尔类型
      return !!item.children.find(c => menus.indexOf(c.key) !== -1)
    }

  }

  // 根据 menu数组生成对应的 标签数组
  // 使用 reduce + 递归调用
  getMenuNodes = (menuList) => {

    // 根据 路径 查找 是否 有赋值 
    let path = this.props.location.pathname
    return menuList.reduce((pre, item) => {

      if (this.hasAuth(item)) {
        // pre 等于是 [] 数组
        // pre 指向的是 第二个参数
        if (!item.children) {
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {

          // 初始展开的 SubMenu 菜单项 key 数组
          let cItem = item.children.find(citem => path.indexOf(citem.key) === 0)
          // 是否有找到
          if (cItem) {
            this.setState({
              key: item.key
            })
          }

          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      return pre
    }, []);
  }

  componentWillMount() {
     this.menuNode = this.getMenuNodes(menuList)
  }

  render() {

    let path = this.props.location.pathname
    let key = this.state.key
    if (path.indexOf('/product') === 0) {
      path = '/product'
    }

    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt="logo" />
          <h1>后台管理</h1>
        </Link>


        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[key]}
          mode="inline"
          theme="dark"
        >
          {this.menuNode}
        </Menu>

      </div>
    )
  }
}

export default withRouter(LeftNav) 