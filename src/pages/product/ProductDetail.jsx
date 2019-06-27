import React from 'react'

import { List, Card, Icon } from 'antd'

import LinkButton from '../../components/linkButton/LinkButton'

import { CategoryIdName } from '../../api/index.js'

const Item = List.Item

class ProductDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pName: '',
      cName: '',
      loading: true
    }
  }

  componentDidMount = async () => {

    
    let { pCategoryId, categoryId } = this.props.location.state

    let result


    if (pCategoryId === '0') {
      result = await CategoryIdName(categoryId)

      if (result.status === 0) {
        this.setState({
          cName: result.data.name
        })
      }
    } else {
      result = await Promise.all([
        CategoryIdName(pCategoryId),
        CategoryIdName(categoryId)
      ])

      this.setState({
        pName: result[0].data.name,
        cName: result[1].data.name
      })
    }

    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 100)
  }



  render() {
    const { name, imgs, desc, price, detail } = this.props.location.state
    let { pName, cName, loading } = this.state

    const title = (
      <span>
        <LinkButton style={{ marginRight: 15 }} onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left'></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} bordered={false}>
        <List itemLayout="horizontal" className='product-detail' loading={loading}>
          <Item>
            <span className='left'>商品名称：</span><span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span><span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span><span>{price}</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span><span>{pName}{ cName ? ' --> ' +  cName : ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片：</span>
            {imgs.map(item =>
              <span key={item}><img src={'http://localhost:5000/upload/' + item} alt="" /></span>
            )}
          </Item>
          <Item>
            <span className='left'>商品详情：</span><span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card>
    )
  }
}

export default ProductDetail