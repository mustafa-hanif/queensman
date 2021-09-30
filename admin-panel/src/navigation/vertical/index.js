import { Mail, Home, Clock } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'client',
    title: 'Clients',
    icon: <Mail size={20} />,
    navLink: '/clients'
  },
  {
    id: 'tickets',
    title: 'Tickets',
    icon: <Mail size={20} />,
    navLink: '/tickets'
  },
  {
    id: 'schedule',
    title: 'Team Schedule',
    icon: <Clock size={20} />,
    navLink: '/schedule'
  },
  {
    id: 'inventory',
    title: 'Inventory',
    icon: <Clock size={20} />,
    navLink: '/inventory'
  },
  {
    id: 'Properties',
    title: 'Properties',
    icon: <Clock size={20} />,
    navLink: '/property'
  },
  {
    id: 'workers',
    title: 'Workers',
    icon: <Clock size={20} />,
    navLink: '/workers'
  },
  {
    id: 'teams',
    title: 'Teams',
    icon: <Clock size={20} />,
    navLink: '/teams'
  },
  {
    id: 'services',
    title: 'Services',
    icon: <Clock size={20} />,
    navLink: '/services'
  }
]
