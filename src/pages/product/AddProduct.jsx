import React from 'react'

import { Card, Form, Input, Button, Icon, Cascader, message } from 'antd'

import LinkButton from '../../components/linkButton/LinkButton'
import PicturesWall from './PicturesWall'
import EditorContent from './Editor-Content'

import { reqCategorys, reqAddorUpdateProduct } from '../../api/index'

const { Item } = Form
const { TextArea } = Input


class AddProduct extends React.Component {
  constructor(props) {
    super(props)

    this.PicturesWall = React.createRef()
    this.editor = React.createRef()
    this.state = {
      options: [],
      product: {},
      isUpdate: false
    }
  }

  getProductCategory = async parentId => {
    let result = await reqCategorys(parentId)

    if (result.status === 0) {
      // 判断是否是一级分类
      let category = result.data
      if (parentId === 0) {
        this.initCategory(category)
      } else {
        /* 是一个 promise 对象  */
        return category
      }
    }
  }

  initCategory = async (category) => {
    // add 获取的是一级分类
    const options = category.map(item => {
      return {
        value: item._id,
        label: item.name,
        isLeaf: false,
      }
    })

    // options.value 拿到一级分类对应的二级分类

    // update 获取的是二级分类
    const { product, isUpdate } = this.state
    if (isUpdate && product.pCategoryId !== '0') {
      // 获取对应的二级分类列表
      let subCategoryId = await this.getProductCategory(product.pCategoryId)

      // 生成二级分类列表
      let childrenCategory = subCategoryId.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))

      // 找到当前商品对应的一级option对象
      let targetOption = options.find(o => o.value === product.pCategoryId)


      // 关联上一级分类列表
      targetOption.children = childrenCategory
    }

    this.setState({
      options
    })
  }

  componentWillMount() {
    let product = this.props.location.state || {}
    let updateProduct = product.product
    let isUpdate = !!updateProduct
    this.setState({
      product: updateProduct,
      isUpdate
    })
  }

  componentDidMount() {
    this.getProductCategory(0)
  }


  // 级联选择的回调
  loadData = async selectedOptions => {
    /* selectedOptions 是 options 中一个对象 {
        value: item._id,
        label: item.name,
        isLeaf: false,
      } */
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    // console.log(targetOption)

    const SecondCategory = await this.getProductCategory(targetOption.value)
    targetOption.loading = false

    if (SecondCategory && SecondCategory.length > 0) {
      // 生成一个二级列表 关联到数组中
      let childrenCategory = SecondCategory.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      targetOption.children = childrenCategory

      // 加载了 二级分类要重新更新一下状态
      this.setState({
        options: [...this.state.options]
      })
    } else {
      // 没有二级分类的直接选中
      targetOption.isLeaf = true

      this.setState({
        options: [...this.state.options]
      })
    }
  }


  // 发送添加/更新请求
  AddandUpdate = () => {
    const { validateFields } = this.props.form
    // 验证器 验证输入框之类是否有数据
    validateFields(async (error, value) => {
      if (!error) {

        // 收集到的数据 添加/修改的数据
        const { name, desc, price, categpryIds } = value
        let pCategoryId, categoryId

        if (categpryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categpryIds[0]
        } else {
          pCategoryId = categpryIds[0]
          categoryId = categpryIds[1]
        }
        const imgs = this.PicturesWall.current.getImgs()
        const detail = this.editor.current.getEditor()

        let product = { name, desc, price, pCategoryId, categoryId, imgs, detail }

        // 调用接口进行 添加/更新
        // 根据 isUpdate 的 id 值 的进行判断
        if (this.state.isUpdate) {
          product._id = this.state.product._id
        }

        console.log(product)

        let result = await reqAddorUpdateProduct(product)

        // 根据结果提示
        if (result.status === 0) {
          message.success(`${this.state.isUpdate ? '更新' : '添加'}商品成功`)
          this.props.history.goBack()
        } else {
          message.error(`${this.state.isUpdate ? '更新' : '添加'}商品失败`)
        }
      }
    })
  }


  render() {

    const { getFieldDecorator } = this.props.form
    const { product, isUpdate } = this.state
    let itemProduct = product || {}
    const { pCategoryId, categoryId } = itemProduct
    let cateId = []
    if (pCategoryId === '0') {
      // 一级分类
      cateId.push(categoryId)
    } else {
      // 二级分类
      cateId.push(pCategoryId)
      cateId.push(categoryId)
    }


    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left'></Icon>
        </LinkButton>
        {isUpdate ? '修改商品' : '添加商品'}
      </span>
    )

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }

    return (
      <Card title={title} bordered={false}>
        <Form {...formItemLayout} autoComplete='off'>
          <Item label='商品名称:'>
            {
              getFieldDecorator('name', {
                initialValue: itemProduct.name,
                rules: [
                  { required: true, message: '请输入商品名称' }
                ]
              })(<Input placeholder='请输入商品名称' />)
            }
          </Item>
          <Item label='商品描述:'>
            {
              getFieldDecorator('desc', {
                initialValue: itemProduct.desc,
                rules: [
                  { required: true, message: '请输入商品描述' }
                ]
              })(<TextArea placeholder='请输入商品描述' autosize={{ minRows: 2, maxRows: 6 }} />)
            }
          </Item>
          <Item label='商品价格:'>
            {
              getFieldDecorator('price', {
                initialValue: itemProduct.price,
                rules: [
                  { required: true, message: '请输入商品价格' }
                ]
              })(<Input type='number' placeholder='请输入商品价格' addonAfter="元" />)
            }
          </Item>
          <Item label='商品分类:'>
            {
              getFieldDecorator('categpryIds', {
                initialValue: cateId,
                rules: [
                  { required: true, message: '请指定商品分类' }
                ]
              })(
                <Cascader
                  placeholder='请指定商品分类'
                  options={this.state.options}
                  loadData={this.loadData}
                />)
            }
          </Item>
          <Item label='商品图片:'>
            <PicturesWall ref={this.PicturesWall} imgs={itemProduct.imgs} />
          </Item>
          <Item label='商品详情:' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} >
            <EditorContent ref={this.editor} detail={itemProduct.detail} />
          </Item>
          <Item wrapperCol={{ offset: 2 }}>
            <Button type='primary' onClick={this.AddandUpdate}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddProduct)