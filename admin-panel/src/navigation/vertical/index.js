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
    id: 'schedule',
    title: 'Team Schedule',
    icon: <Clock size={20} />,
    navLink: '/schedule'
  }
]
