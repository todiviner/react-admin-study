import React from 'react'

import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import ProductHome from './ProductHome'
import AddProduct from './AddProduct'
import ProductDetail from './ProductDetail'

import './product.less'




class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = {  }
  }
  render() {
    return (
      <Switch>
        <Route path='/product' component={ProductHome} exact />
        <Route path='/product/addproduct' component={AddProduct} />
        <Route path='/product/detail' component={ProductDetail} />
        <Redirect to='/product' />
      </Switch>
    )
  }
}

export default Product