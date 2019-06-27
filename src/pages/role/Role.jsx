import React from 'react'

import { Card, Button, Table, Modal, message } from 'antd'

import moment from 'moment'

import { reqRoleList, reqAddRoleName, reqUpdateRole } from '../../api/index'

import AddForm from './Add-Form.jsx'
import RoleAuth from './RoleAuth'

import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'

class Role extends React.Component {

  state = {
    roles: [],          // 获取数据角色列表
    role: {},           // 点击时的每一行
    isShowRole: false, // 是否显示添加角色
    form: {},            // 子组件传过来的对象
    isShowRoleAuth: false   // 是否显示设置权限
  }

  constructor(props) {
    super(props);

    this.auth = React.createRef()
  }


  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ]
  }

  getRoleList = async () => {
    let result = await reqRoleList()
    if (result.status === 0) {
      this.setState({
        roles: result.data
      })
    }
  }

  /* 点击确定 添加角色 */
  addRole = () => {
    const { form } = this.state
    form.validateFields(async (error, value) => {
      if (!error) {
        // 1. 关闭 modal 框 
        this.setState({
          isShowRole: false
        })

        // 2. 校验数据 并提交
        let { roleName } = value

        const result = await reqAddRoleName(roleName)

        // 清空输入框
        form.resetFields()

        if (result.status === 0) {
          message.success('添加成功!')

          const role = result.data

          // 3. 把数据并入数组中
          this.setState((state) => ({
            roles: [...state.roles, role]
          }), () => this.getRoleList())
        } else {
          message.error('添加失败!')
        }
      }
    })
  }

  /* 更新角色权限 */
  setRoleAuth = async () => {
    // 1. 关闭 modal 框
    this.setState({
      isShowRoleAuth: false
    })

    // 获取需要发送请求的数据
    const user = storageUtil.getUser()
    const { role } = this.state
    let menus = this.auth.current.getCheck()
    role.menus = menus
    role.auth_name = user.username
    role.auth_time = Date.now()

    // 发送请求保存数据
    let result = await reqUpdateRole(role)

    if (result.status === 0) {
      if (role._id === user.role_id) {
        memoryUtil.user = {}
        storageUtil.delUser()
        this.props.history.replace('/login')
        message.success('修改了权限，请重新登录')
      } else {
        message.success('设置权限成功')

        this.setState({
          roles: [...this.state.roles]
        })
      }

    } else {
      message.erroe('设置权限失败')
    }
  }

  onRow = role => {
    return {
      onClick: event => {
        this.setState({
          role
        })
      }, // 点击行
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getRoleList()
  }

  render() {

    const { roles, role, isShowRole, isShowRoleAuth } = this.state

    const title = (
      <div>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => { this.setState({ isShowRole: true }) }}
        >
          创建角色
        </Button>
        <Button
          type='primary'
          disabled={!role._id}
          onClick={() => this.setState({ isShowRoleAuth: true })}
        >
          设置角色权限
          </Button>
      </div>
    )

    return (
      <Card title={title} bordered={false}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: role => this.setState({role})
          }}
          onRow={this.onRow}
          pagination={{
            defaultPageSize: 5
          }}
        />
        <Modal
          title="添加角色"
          visible={isShowRole}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowRole: false })
            this.state.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => { this.setState({ form }) }}
          />
        </Modal>

        <Modal
          title="添加角色"
          visible={isShowRoleAuth}
          onOk={this.setRoleAuth}
          onCancel={() => {
            this.setState({ isShowRoleAuth: false })
            // this.state.form.resetFields()
          }}
        >
          <RoleAuth role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}

export default Role