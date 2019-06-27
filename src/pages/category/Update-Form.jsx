import React from 'react';
import { Form, Input } from 'antd'

import PropTypes from 'prop-types';

const Item = Form.Item

class UpdateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  
  render() {
    let { getFieldDecorator } = this.props.form
    let { categoryName } = this.props
    return (
      <Form>
        <Item>
          <p style={{ marginBottom: 0 }}>分类名称:</p>
          {getFieldDecorator('categoryName', {
            initialValue: categoryName
          })(
            <Input placeholder='请输入更新分类的名称' />
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
export default Form.create()(UpdateForm)