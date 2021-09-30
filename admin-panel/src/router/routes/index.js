import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Queensman Admin Panel'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/download-contract/:document_id',
    component: lazy(() => import('../../views/DownloadContract')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/clients',
    component: lazy(() => import('../../views/clients'))
  },
  {
    path: '/tickets',
    component: lazy(() => import('../../views/tickets'))
  },
  {
    path: '/inventory',
    component: lazy(() => import('../../views/inventory'))
  },
  {
    path: '/property',
    component: lazy(() => import('../../views/property'))
  },
  {
    path: '/workers',
    component: lazy(() => import('../../views/workers'))
  },
  {
    path: '/teams',
    component: lazy(() => import('../../views/teams'))
  },
  {
    path: '/services',
    component: lazy(() => import('../../views/services'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/schedule',
    component: lazy(() => import('../../views/schedule'))
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
