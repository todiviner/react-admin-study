import React from 'react'

import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


class EditorContent extends React.Component {

  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props)

    const html = this.props.detail
    if (html) {
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState,
        }
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      }
    }
  }


  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  // 获取输入设置的HTML标签内容
  getEditor = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

   uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          resolve({
            data: {
                link: response.data.url  // 得到图片的url地址
            }
        })
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: '1px solid #000', minHeight: '200px', paddingLeft: 15 }}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
      />
    )
  }
}

export default EditorContent