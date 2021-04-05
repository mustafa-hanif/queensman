// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import calendar from '@src/views/schedule/store/reducer'

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  calendar
})

export default rootReducer
