import React from 'react';
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

// 纯组件 shouldComponentUpdate 自动判断更新 

class UserForm extends React.PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    role: PropTypes.array.isRequired,
    user: PropTypes.object,
  }


  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { role } = this.props
    const user = this.props.user || {}

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <Form {...formItemLayout} autoComplete='off'>
        <Item label='用户名:'>
          {
            getFieldDecorator('username', {
              initialValue: user.username
            })(
              <Input placeholder='请输入用户名' />
            )
          }
        </Item>
        {
          user._id ? null :
            <Item label='密码:'>
              {
                getFieldDecorator('password', {
                  initialValue: ''
                })(
                  <Input placeholder='请输入密码' type="password" />
                )
              }
            </Item>
        }
        <Item label='手机号:'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(
              <Input placeholder='请输入手机号' />
            )
          }
        </Item>
        <Item label='邮箱:'>
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(
              <Input placeholder='请输入邮箱' type="email" />
            )
          }
        </Item>
        <Item label='角色:'>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id
            })(
              <Select>
                {
                  role.map(role => (
                    <Option value={role._id} key={role._id}>{role.name}</Option>
                  ))
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

/* 
 高阶组件
  被包裹的组件获得一个新的对象：form
*/
export default Form.create()(UserForm)