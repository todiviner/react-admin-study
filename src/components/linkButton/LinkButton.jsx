import React from 'react';

import './LinkButton.less'

export default function LinkButton(props) {
  return <button {...props} className='link_button'>{props.children}</button>
}