import React from 'react'

import { Card, Button, Icon, Table, Modal, message } from 'antd'

import LinkButton from '../../components/linkButton/LinkButton'

import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api/index.js'

import AddForm from './Add-Form'
import UpdateForm from './Update-Form'

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      categorys: [],        // 一级分类列表
      subCategorys: [],     // 二级分类列表
      columns: [],          // 表格的每一行
      parentId: '0',        // 当前显示分类列表的分类ID
      parentName: '',        // 当前需要显示的分类列表的父类名称
      showStatus: 0,         // 0 不显示  1显示添加分类    2显示更新分类
      category: '',       // 修改分类的名字
      form: {}                //  子组件传给父组件的对象属性
    };
  }

  initColumns = () => {
    let columns = [
      {
        title: '分类',
        dataIndex: 'name',
        key: 'name',
      },
      {
        width: 300,
        title: '操作',
        render: (category) => {
          return <span>
            <LinkButton onClick={() => { this.showUpdateModal(category) }}>修改分类</LinkButton>
            {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategory(category)}>查看子分类</LinkButton> : null}
          </span>
        }
      }
    ]

    this.setState({
      columns
    })

  }
  // 响应 隐藏 modal 框
  handleCancel = () => {
    this.state.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  // 显示添加 modal 框
  showAddModal = () => {
    this.setState({
      showStatus: 1
    })
  }
  // 添加分类
  addCategory = async () => {
    // console.log('addCategory')
    // 1. 隐藏 对话框
    this.setState({
      showStatus: 0
    })

    // 2. 添加 分类
    // reqAddCategory = (parentId, categoryName)
    let { parentId, categoryName } = this.state.form.getFieldsValue()
    let result = await reqAddCategory(parentId, categoryName)

    this.state.form.resetFields()

    if (result.status === 0) {
      if (parentId === this.state.parentId) {
        message.success('添加成功!')
        this.getCategoryList()
      } else if (parentId === '0') {
        message.success('添加成功!')
        this.getCategoryList('0')
      } else {
        message.success('添加成功!')
      }
    } else {
      message.error('添加失败!')
    }
  }

  // 显示更新 modal 框
  showUpdateModal = (category) => {
    this.setState({
      showStatus: 2,
      category: category
    })
  }
  // 更新分类
  updateCategory = () => {
    // console.log('updateCategory')
    // 1. 隐藏 对话框
    this.setState({
      showStatus: 0
    })
    // 2. 更新分类名称
    let { category, form } = this.state
    let id = category._id
    form.validateFields(async (error, value) => {
      if (!error) {
        
        let result = await reqUpdateCategory(id, value.categoryName)
        this.state.form.resetFields()

        if (result.status === 0) {
          message.success('更新成功！')
          // 3. 数据重新渲染
          this.getCategoryList()
        } else {
          message.error('更新失败！')
        }
      }
    })
  }

  // 显示一级对应的二级分类
  showSubCategory = (category) => {

    //更换分类id
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategoryList()
    })

  }

  // 显示/返回一级分类列表
  showFirstCategory = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  // 获取一级/二级分类列表信息
  getCategoryList = async (parentId) => {

    parentId = parentId || this.state.parentId

    this.setState({ loading: true })

    let res = await reqCategorys(parentId)
    let { status, data } = res

    if (status === 0) {
      if (parentId === '0') {
        this.setState({
          categorys: data,
          loading: false
        })
      } else {
        this.setState({
          subCategorys: data,
          loading: false
        })
      }
    }
  }

  // 获取子组件的form对象属性
  // setForm = (form) => {
  //   this.setState({
  //     form
  //   })
  // }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getCategoryList()
  }


  render() {

    let { categorys, columns, loading, parentName, parentId, subCategorys, showStatus, category } = this.state

    const extra = (
      <Button
        type="primary"
        onClick={this.showAddModal}
      >
        <Icon type='plus'></Icon>
        添加
      </Button>
    )



    return (
      <Card title={parentId === '0' ? "一级分类列表" :
        <span>
          <LinkButton onClick={this.showFirstCategory}>一级分类列表</LinkButton>
          <Icon type='arrow-right' style={{ marginRight: 5 }}></Icon>
          <span>{parentName}</span>
        </span>}
        extra={extra}
        bordered={false}
      >
        <Table bordered={true}
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={columns}
          rowKey='_id'
          loading={loading}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            setForm={(form) => { this.setState({ form }) }}
            categorys={categorys}
            parentId={parentId}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={category.name} setForm={(form) => { this.setState({ form }) }} />
        </Modal>
      </Card>
    )
  }
}

export default Category