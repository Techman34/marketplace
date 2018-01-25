import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  EDIT_PARCEL_SUCCESS
} from './actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import { buildCoordinate } from 'lib/utils'
import { toParcelObject } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: false,
  error: null
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCELS_REQUEST: {
      return {
        ...state,
        loading: true
      }
    }
    case FETCH_PARCELS_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels)
        }
      }
    }
    case FETCH_PARCELS_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.error
      }
    }
    case EDIT_PARCEL_SUCCESS: {
      const { parcel } = action
      return {
        ...state,
        data: {
          ...state.data,
          [parcel.id]: parcel
        }
      }
    }
    case TRANSFER_PARCEL_SUCCESS: {
      const { x, y, newOwner } = action.transfer
      const parcelId = buildCoordinate(x, y)
      const parcel = state.data[parcelId]
      return {
        ...state,
        data: {
          ...state.data,
          [parcel.id]: {
            ...parcel,
            owner: newOwner.toLowerCase()
          }
        }
      }
    }
    default:
      return state
  }
}

export const getState = state => state.parcels
export const getParcels = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error