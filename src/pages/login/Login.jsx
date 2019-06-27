import React from 'react'
/*  登录组件 */
/* 导入 less 样式 */
import './Login.less'

// 导入图片
import logo from '../../assets/images/logo.png'

// 请求 导入
import { reqLogin } from '../../api/index'

import { withRouter } from 'react-router-dom'

// 保存登录数据
import memoryUtil from '../../utils/memoryUtil'
// local存储用户信息
import storageUtil from '../../utils/storageUtil'

/* 重定向路由组件 */
import { Redirect } from 'react-router-dom'

// 导入 antd-UI 组件
import { Form, Icon, Input, Button, message } from 'antd'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSubmit = e => {
    // 阻止事件的默认行为
    e.preventDefault()

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        let { username, password } = values

        // 抛出异常
        // try {
        //   let res = await reqLogin(username, password)
        //   console.log('请求成功',res)
        // } catch (error) {
        //   console.log('请求失败',error)
        // }

        let res = await reqLogin(username, password)
        console.log(res)

        if (res.status === 0) {
          message.success('登录成功')
          // 保存用户登录数据
          // memoryUtil.user = res.data
          // 用户信息local存储
          storageUtil.saveUser(res.data)
          // 跳转到管理界面（不用再后退，跳回）
          this.props.history.replace('/')

        } else { // 登录失败
          message.error(res.msg)
        }

      } else {
        console.log('校验失败')
      }
    });

    // 得到 form 对象
    // let { getFieldsValue } = this.props.form
    // 获取表单项的数据
    // let values = getFieldsValue()
    // console.log(values)
  }

  // 密码校验 函数 验证器
  validator = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码，不能为空')
    } else if (value.length < 4) {
      callback('密码最少4位')
    } else if (value.length > 12) {
      callback('最多12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('请输入合法字符')
    }

    callback() // 校验成功 回调函数
  }

  render() {
    // 如果用户已经登录，就不用再登录了
    const user = memoryUtil.user
    if (user && user._id) {
      return <Redirect to='/' />
    }

    const { getFieldDecorator } = this.props.form
    return (
      <div className='login-container'>
        <header className='login-title'>
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {
                getFieldDecorator('username', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入用户名' },
                    { mix: 4, message: '最少4位' },
                    { max: 12, message: '最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '请输入合法字符' },
                  ],
                  initialValue: 'admin'
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名" autoComplete='off'
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validator
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                    autoComplete='off'
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>登录</Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
/* 
 1. 高阶函数

 2. 高阶组件
*/

/* 用Form.create()(组件)包装Login组件生成一个新的组件：Form(Login)
  Form新组件会向Login组件传递一个强大的对象属性：form
*/
Login = Form.create()(Login)

export default withRouter(Login)