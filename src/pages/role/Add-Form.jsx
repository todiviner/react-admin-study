import React from 'react';
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class AddForm extends React.Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    let { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form autoComplete='off' {...formItemLayout}>
        <Item label='角色名称:'>
          {getFieldDecorator('roleName', {
            initialValue: '',
            rules: [{ required: true, message: '必须输入角色名称' }]
          })(
            <Input placeholder='请输入角色名称' />
          )}
        </Item>
      </Form>
    )
  }
}

/* 
 高阶组件
  被包裹的组件获得一个新的对象：form
*/
export default Form.create()(AddForm)