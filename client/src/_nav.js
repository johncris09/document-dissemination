import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilArrowThickFromBottom, cilArrowThickFromTop } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = (userInfo) => {
  let items = [
    {
      component: CNavItem,
      name: 'External Document',
      to: '/external_document',
      icon: <CIcon icon={cilArrowThickFromBottom} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Internal Document',
      to: '/internal_document',
      icon: <CIcon icon={cilArrowThickFromTop} customClassName="nav-icon" />,
    },
  ]
  return items
}

export default _nav
