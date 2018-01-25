import { combineReducers } from 'redux'

import loading from './loading/reducer'
import map from './map/reducer'
import modal from './modal/reducer'
import sidebar from './sidebar/reducer'

export * from './loading/reducer'
export * from './map/reducer'
export * from './modal/reducer'
export * from './sidebar/reducer'

export default combineReducers({
  loading,
  map,
  modal,
  sidebar
})