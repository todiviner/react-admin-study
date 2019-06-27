import React from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import moment from 'moment'

import { reqWeather } from '../../api/index'
import storageUtil from '../../utils/storageUtil'
import memoryUtil from '../../utils/memoryUtil'
import menuList from '../../config/menuConfig'
import LinkButton from '../linkButton/LinkButton';


import './header.less'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      dayPictureUrl: '',
      weather: '',
      user: storageUtil.getUser(),
      timer: ''
    }
  }

  // 获取时间更新
  getTime = () => {
   let timer = setInterval(() => {
      this.setState({
        currentTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      })
    }, 1000);

    this.setState({
      timer
    })
  }
  // 获取天气数据
  getWeather = async () => {
    let { dayPictureUrl, weather } = await reqWeather('肇庆')
    this.setState({
      dayPictureUrl,
      weather
    })
  }

  // 获取标题
  getTitle = () => {
    let path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        let cItem = item.children.find(item => path.indexOf(item.key) === 0)
        if (cItem) {
          title = cItem.title
        }
      }
    })

    return title
  }

  logout = () => {
    Modal.confirm({
      title: '是否退出?',
      onOk: () => {
        // 删除loal存储
        // 清空内存 user
        storageUtil.delUser()
        memoryUtil.user = {}
        // 跳转 login 页面
        this.props.history.replace('/login')
      }
    })
  }

  componentDidMount() {
    // 获取时间
    this.getTime()
    // 获取天气数据
    this.getWeather()
  }

  render() {
    let title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎, {this.state.user.username}</span>
          <span><LinkButton onClick={this.logout}>退出</LinkButton></span>
        </div>
        <div className='header-bottom'>
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{this.state.currentTime}</span>
            <img src={this.state.dayPictureUrl} alt="weather" title={this.state.weather} />
            <span>{this.state.weather}</span>
          </div>
        </div>
      </div>
    )
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
}

export default withRouter(Header)