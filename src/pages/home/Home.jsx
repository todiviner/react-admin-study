import React from 'react'

import './Home.less'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='home-content'>欢迎使用XX后台管理系统</div>
    );
  }
}

export default Home;