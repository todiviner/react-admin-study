import React from 'react'

import { Card, Table, Button, Modal, message } from 'antd'
import moment from 'moment'

import { reqUserList, reqDeleteUser, reqAddOrUpdateUser } from '../../api/index'

import LinkButton from '../../components/linkButton/LinkButton'
import UserForm from './User-Form'

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [], // 所有用户列表
      roles: [],  // 所有角色列表信息
      isShow: false // 显示或者隐藏 modal
    }
  }

  /* 添加或者修改用户 */
  addOrUpdateUesr = async () => {

    this.setState({
      isShow: false
    })

    // 获取表单中所有数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()

    // 如果是修改要对应 id
    if (this.user) {
      user._id = this.user._id
    }

    // 发送请求 添加用户
    const result = await reqAddOrUpdateUser(user)

    if (result.status === 0) {
      message.success(`${this.user ? '修改': '添加'}用户成功!`)
      this.getUserList()
    }
  }

  /* 查找 name */
  initRoleName = (roles) => {
    let roleName = roles.reduce((pre, role) => {

      pre[role._id] = role.name

      return pre
    }, {});

    this.roleName = roleName
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: (create_time) => moment(create_time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleName[role_id]
      },
      {
        title: '操作',
        dataIndex: '',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)} >删除</LinkButton>
          </span>
        )
      }
    ]
  }

  /* 显示修改界面 */
  showUpdate = (user) => {
    /* 放进内存中 */
    this.user = user

    this.setState({
      isShow: true
    })
  }

  /* 删除用户 */
  deleteUser = (user) => {
    Modal.confirm({
      title: `你确认删除${user.username}`,
      onOk: async () => {
        let result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功!')
          this.getUserList()
        }
      }
    });
  }

  getUserList = async () => {
    const result = await reqUserList()

    if (result.status === 0) {
      const { users, roles } = result.data

      this.initRoleName(roles)

      this.setState({  // 因为时初始化数据，所以用对象形式的
        users,
        roles
      })
    }
  }

  /* 组件运行时只执行一次 */
  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUserList()
  }


  render() {

    const { users, isShow, roles } = this.state
    const user = this.user || {}

    const title = (
      <span>
        <Button type='primary' onClick={() => {
          this.user = null  // 点击取消重新赋值为空
          this.setState({ isShow: true })
        }}>创建用户</Button>
      </span>
    )

    return (
      <Card
        bordered={false}
        title={title}
      >
        <Table
          dataSource={users}
          columns={this.columns}
          bordered={true}
          rowKey='_id'
          pagination={{ defaultPageSize: 5 }}
        />
        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          onOk={this.addOrUpdateUesr}
          onCancel={() => {
            this.form.resetFields()  // 重置所有输入框为空
            this.setState({ isShow: false })
          }}
        >
          <UserForm setForm={(form) => this.form = form} role={roles} user={user} />
        </Modal>
      </Card>
    )
  }
}

export default User