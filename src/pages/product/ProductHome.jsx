import React from 'react'

import { Card, Select, Button, Table, Input, Icon, message } from 'antd'

import LinkButton from '../../components/linkButton/LinkButton'

import { reqProducts, reqProductSearch, reqUpdateStatus } from '../../api/index'



const Option = Select.Option

class ProductHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],       // table 中 title 和 每一行
      products: [],       // 获取商品列表
      total: 0,            // 显示数据一共多少条
      // pages: 3,           // 显示一共多少页
      pageSize: 3,        // 显示每页多少条目/数据
      loading: false,
      searchType: 'productName',
      searchName: '',
      pageNum: 0
    }
  }

  updateStatus = async (id, status) => {
    let result = await reqUpdateStatus(id, status)

    if (result.status === 0) {
      message.success('更新成功!')
      this.getProductList(this.state.pageNum)
    }
  }

  initColumns = () => {
    let columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        // dataIndex 有值代表自己所在的对象属性
        // dataIndex 没值代表的是整条数组的对象
        render: (price) => '￥' + price
      },
      {
        width: 100,
        title: '操作',
        // 1 代表在售 0 代表下架
        render: (product) => {
          const { status, _id } = product
          return (
            <span>
              <Button type='primary' onClick={() => this.updateStatus(_id, status === 1 ? 0 : 1)}>{status === 1 ? '下架' : '上架'}</Button>
              {status === 1 ? '在售' : '已下架'}
            </span>
          )
        }
      },
      {
        width: 100,
        title: '状态',
        // dataIndex 没值代表的是整条数组的对象
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addProduct', { product })}>修改</LinkButton>
            </span>
          )
        }
      },
    ]
    this.setState({
      columns
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  // 获取商品列表数据
  getProductList = async (pageNum) => {
    this.pageNum = pageNum

    this.setState({
      loading: true,
      
    })

    const { pageSize, searchType, searchName } = this.state

    let result = ''

    if (searchName) {
      result = await reqProductSearch({pageNum, pageSize, searchType, searchName})
    } else {
      result = await reqProducts(pageNum, pageSize)
    }

    this.setState({
      loading: false
    })

    let { total, list } = result.data

    if (result.status === 0) {
      this.setState({
        total,
        products: list
      })
    }

  }

  componentDidMount() {
    this.getProductList(1)
  }


  render() {

    const { columns, products, total, pageSize, loading, searchType, searchName } = this.state

    let title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={(value) => { this.setState({ searchType: value }) }}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{ width: 150, margin: '0 15px', }}
          value={searchName}
          onChange={e => this.setState({ searchName: e.target.value })}
        />
        <Button type='primary' onClick={() => this.getProductList(1)}>搜索</Button>
      </span>
    )

    let extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addproduct')}>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )


    return (
      <Card
        title={title}
        extra={extra}
        bordered={false}
      >
        <Table
          loading={loading}
          dataSource={products}
          rowKey='_id'
          columns={columns}
          bordered={true}
          pagination={
            {
              current: this.pageNum,
              total,
              showQuickJumper: true,
              defaultPageSize: pageSize,
              onChange: this.getProductList
            }
          }
        />
      </Card>
    )
  }
}

export default ProductHome