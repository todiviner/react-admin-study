import React from 'react';
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  
  render() {
    let { getFieldDecorator } = this.props.form
    let { categorys, parentId } = this.props
    return (
      <Form>
        <Item>
          <p style={{ marginBottom: 0 }}>所属分类:</p>
          {getFieldDecorator('parentId', {
            initialValue: parentId
          })(
            <Select>
              <Option value='0'>一级分类</Option>
              {categorys.map(item => 
                <Option value={item._id} key={item.parentId}>{item.name}</Option>
                )}
            </Select>
          )}
        </Item>
        <Item>
          <p style={{ marginBottom: 0 }}>分类名称:</p>
          {getFieldDecorator('categoryName', {
            initialValue: ''
          })(
            <Input placeholder='请输入添加分类的名称' />
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