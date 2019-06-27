import { Upload, Icon, Modal, message } from 'antd'
import React from 'react'

import { reqDeleteImage } from '../../api/index.js'


export default class PicturesWall extends React.Component {
  constructor(props) {
    super(props)

    // fileList: [
    //   // {
    //   //   uid: '-1',
    //   //   name: 'xxx.png',
    //   //   status: 'done',
    //   //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   // },
    // ],
    let fileList = []

    const imgs = this.props.imgs || []

    if (imgs && imgs.length > 0) {
      fileList = imgs.map((item, index) => ({
        uid: -index,
        name: item,
        status: 'done',
        url: 'http://localhost:5000/upload/' + item,
      }))
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    };
  }


  // 父组件调用子组件用ref
  getImgs = () => {
    const fileList = this.state.fileList || []
    /* 把需要抽离出来 自动返回一个数组*/
    const imgUrl = fileList.map(item => {
      return item.name
    })
    return imgUrl
  }

  /* 隐藏Modal */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    /* 显示指定file对应的大图 */
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  /* file: 当前操作的图片文件(上传/删除) */
  /* fileList: 所有已上传图片文件对象的数组 */
  handleChange = async ({ file, fileList }) => {
    /* fileList[fileList.length - 1] 代表上传当前下标 的图片位置 */
    // console.log(file)
    // console.log('handleChange()', file.status, fileList.length, file === fileList[fileList.length - 1], fileList[fileList.length - 1])
    if (file.status === 'done') {
      const result = file.response
      // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
      if (result.status === 0) {
        message.success('上传图片成功!')
        const { name, url } = result.data
        /* 将上传的文件作进一步修改 */
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      }
    } else if (file.status === 'removed') {
      console.log(file)
      console.log(fileList)
      const result = await reqDeleteImage(file.name)
      console.log(result)
      if (result.status === 0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    // console.log(fileList)
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          accept="image/*"  /* 只接收图片格式  */
          action="/manage/img/upload"   /* 上传图片的接口地址 */
          name="image"  /* 请求参数名 */
          listType="picture-card"
          fileList={fileList} /*所有已上传图片文件对象的数组*/
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}