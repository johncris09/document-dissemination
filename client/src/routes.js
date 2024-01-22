import React from 'react'
const ExternalDocument = React.lazy(() => import('./views/external_document/ExternalDocument'))
const InternalDocument = React.lazy(() => import('./views/internal_document/InternalDocument'))

const routes = [
  { path: '/', exact: true, name: 'External Document' },
  { path: '/external_document', name: 'External Document', element: ExternalDocument },
  { path: '/internal_document', name: 'Internal Document', element: InternalDocument },
]

export default routes
