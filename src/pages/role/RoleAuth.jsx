import React from 'react';
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'


const Item = Form.Item
const { TreeNode } = Tree

export default class AddForm extends React.Component {

  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props);
    
    const menus = this.props.role.menus
    
    this.state = {
      checkedKeys: menus
    }
  }
  
  /* oncheck 事件 触发 checkedKeys 的状态更新 */
  onCheck = checkedKeys => {
    console.log(checkedKeys)
    this.setState({
      checkedKeys
    })
  }

  getCheck = () => {
    return this.state.checkedKeys
  }

  getRoleAuthTree = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push((
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getRoleAuthTree(item.children) : null}
        </TreeNode>
      ))

      return pre
    }, [])
  }

  componentWillMount() {
    this.treeNodes = this.getRoleAuthTree(menuList)
  }

  /* 从父组件中传来的 porps 需要更新的数据 生命周期 */
  componentWillReceiveProps(nextProps) {
    this.setState({
      checkedKeys: nextProps.role.menus
    })
  }

  render() {

    const { checkedKeys } = this.state
    const { role } = this.props

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form autoComplete='off' {...formItemLayout}>
        <Item label='角色名称:'>
          <Input placeholder='请输入角色名称' disabled value={role.name} />
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys} // 获取的是 menus 数组 受控组件 
          onCheck={this.onCheck}
        >
          <TreeNode title='平台权限' key='all'>
          {this.treeNodes}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}

/*
 高阶组件
  被包裹的组件获得一个新的对象：form
*/