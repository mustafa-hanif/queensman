import { Table, Home, Clock, Users, Book, Briefcase, Layers, ArrowRight, Codesandbox, Tablet } from 'react-feather'

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
    icon: <Users size={20} />,
    navLink: '/clients'
  },
  {
    id: 'tickets',
    title: 'Tickets',
    icon: <Book size={20} />,
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
    icon: <Briefcase size={20} />,
    navLink: '/inventory'
  },
  {
    id: 'Properties',
    title: 'Properties',
    icon: <Layers size={20} />,
    navLink: '/property'
  },
  {
    id: 'workers',
    title: 'Workers',
    icon: <Tablet size={20} />,
    navLink: '/workers'
  },
  {
    id: 'teams',
    title: 'Teams',
    icon: <ArrowRight size={20} />,
    navLink: '/teams'
  },
  {
    id: 'services',
    title: 'Services',
    icon: <Codesandbox size={20} />,
    navLink: '/services'
  }
]
