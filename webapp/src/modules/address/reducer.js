import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_PARCELS_SUCCESS,
  FETCH_ADDRESS_PARCELS_FAILURE,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS,
  FETCH_ADDRESS_CONTRIBUTIONS_FAILURE,
  FETCH_ADDRESS_PUBLICATIONS_REQUEST,
  FETCH_ADDRESS_PUBLICATIONS_SUCCESS,
  FETCH_ADDRESS_PUBLICATIONS_FAILURE,
  FETCH_ADDRESS_ESTATES_REQUEST,
  FETCH_ADDRESS_ESTATES_SUCCESS,
  FETCH_ADDRESS_ESTATES_FAILURE
} from './actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { BUY_SUCCESS } from 'modules/publication/actions'
import {
  EDIT_ESTATE_PARCELS_SUCCESS,
  TRANSFER_ESTATE_SUCCESS,
  DELETE_ESTATE_SUCCESS,
  CREATE_ESTATE_SUCCESS,
  REMOVE_PARCELS
} from 'modules/estates/actions'
import { getEstateIdFromTxReceipt } from 'modules/estates/utils'
import { loadingReducer } from 'modules/loading/reducer'
import { buildCoordinate } from 'shared/parcel'
import { toAddressParcelIds, toAddressPublicationIds } from './utils'

const EMPTY_ADDRESS = {
  contributions: [],
  parcel_ids: [],
  publication_ids: [],
  estate_ids: []
}

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function addressReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ADDRESS_PARCELS_REQUEST:
    case FETCH_ADDRESS_CONTRIBUTIONS_REQUEST:
    case FETCH_ADDRESS_PUBLICATIONS_REQUEST:
    case FETCH_ADDRESS_ESTATES_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            contributions: action.contributions
          }
        }
      }
    case FETCH_ADDRESS_PARCELS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            parcel_ids: Object.keys(action.parcels)
          }
        }
      }
    case FETCH_ADDRESS_ESTATES_SUCCESS: {
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            estate_ids: Object.keys(action.estates)
          }
        }
      }
    }
    case FETCH_ADDRESS_PUBLICATIONS_SUCCESS: {
      const addressData = state.data[action.address] || {}
      const { parcels, publications } = action

      const parcel_ids = new Set([
        ...(addressData.parcel_ids || []),
        ...toAddressParcelIds(parcels)
      ])

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...addressData,
            publication_ids: toAddressPublicationIds(publications),
            parcel_ids: Array.from(parcel_ids)
          }
        }
      }
    }
    case FETCH_ADDRESS_CONTRIBUTIONS_FAILURE:
    case FETCH_ADDRESS_PUBLICATIONS_FAILURE:
    case FETCH_ADDRESS_PARCELS_FAILURE:
    case FETCH_ADDRESS_ESTATES_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.transaction

      switch (transaction.actionType) {
        case TRANSFER_PARCEL_SUCCESS: {
          const { oldOwner, newOwner, x, y } = transaction.payload
          const parcelId = buildCoordinate(x, y)
          const oldOwnerAddress = state.data[oldOwner] || { ...EMPTY_ADDRESS }
          const newOwnerAddress = state.data[newOwner] || { ...EMPTY_ADDRESS }
          return {
            ...state,
            data: {
              ...state.data,
              [oldOwner]: {
                ...oldOwnerAddress,
                parcel_ids: oldOwnerAddress.parcel_ids.filter(
                  x => x !== parcelId
                )
              },
              [newOwner]: {
                ...newOwnerAddress,
                parcel_ids: newOwnerAddress.parcel_ids.concat(parcelId)
              }
            }
          }
        }
        case BUY_SUCCESS: {
          const { x, y } = transaction.payload
          const parcelId = buildCoordinate(x, y)
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...state.data[transaction.from],
                parcel_ids: [
                  ...state.data[transaction.from].parcel_ids,
                  parcelId
                ]
              }
            }
          }
        }
        case EDIT_ESTATE_PARCELS_SUCCESS: {
          const { parcels, type } = transaction.payload
          const user = state.data[transaction.from]
          let updatedParcelIds = []

          if (type === REMOVE_PARCELS) {
            updatedParcelIds = [
              ...user.parcel_ids,
              ...parcels.map(p => buildCoordinate(p.x, p.y))
            ]
          } else {
            updatedParcelIds = user.parcel_ids.filter(
              parcelId =>
                !parcels.some(
                  estateParcel =>
                    buildCoordinate(estateParcel.x, estateParcel.y) === parcelId
                )
            )
          }

          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                parcel_ids: updatedParcelIds
              }
            }
          }
        }
        case TRANSFER_ESTATE_SUCCESS: {
          const { estate, to } = transaction.payload
          const fromUser = state.data[transaction.from] || { ...EMPTY_ADDRESS }
          const toUser = state.data[to] || { ...EMPTY_ADDRESS }
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...fromUser,
                estate_ids: fromUser.estate_ids.filter(
                  estateId => estateId !== estate.asset_id
                )
              },
              [to]: {
                ...toUser,
                estate_ids: [...toUser.estate_ids, estate.asset_id]
              }
            }
          }
        }
        case DELETE_ESTATE_SUCCESS: {
          const { estate } = transaction.payload
          const user = state.data[transaction.from]
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                parcel_ids: [
                  ...user.parcel_ids,
                  ...estate.data.parcels.map(parcel =>
                    buildCoordinate(parcel.x, parcel.y)
                  )
                ]
              }
            }
          }
        }
        case CREATE_ESTATE_SUCCESS: {
          const { receipt } = transaction
          const { estate } = transaction.payload
          const estateId = getEstateIdFromTxReceipt(receipt)
          const user = state.data[transaction.from]
          const updatedParcelIds = user.parcel_ids.filter(
            parcelId =>
              !estate.data.parcels.some(
                estateParcel =>
                  buildCoordinate(estateParcel.x, estateParcel.y) === parcelId
              )
          )

          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                parcel_ids: updatedParcelIds,
                estate_ids: [...user.estate_ids, estateId]
              }
            }
          }
        }
        default: {
          return state
        }
      }
    }
    default:
      return state
  }
}
