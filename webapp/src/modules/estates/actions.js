import { buildTransactionAction } from 'modules/transaction/utils'

export const ADD_PARCELS = 'add'
export const REMOVE_PARCELS = 'remove'

// Create Estate

export const CREATE_ESTATE_REQUEST = '[Request] Create Estate'
export const CREATE_ESTATE_SUCCESS = '[Success] Create Estate'
export const CREATE_ESTATE_FAILURE = '[Failure] Create Estate'

export function createEstateRequest(estate) {
  return {
    type: CREATE_ESTATE_REQUEST,
    estate
  }
}

export function createEstateSuccess(txHash, estate) {
  return {
    type: CREATE_ESTATE_SUCCESS,
    ...buildTransactionAction(txHash, {
      estate,
      txHash
    }),
    estate
  }
}

export function createEstateFailure(error) {
  return {
    type: CREATE_ESTATE_FAILURE,
    error
  }
}

// Fetch Estate

export const FETCH_ESTATE_REQUEST = '[Request] Fetch Estate'
export const FETCH_ESTATE_SUCCESS = '[Success] Fetch Estate'
export const FETCH_ESTATE_FAILURE = '[Failure] Fetch Estate'

export function fetchEstateRequest(assetId) {
  return {
    type: FETCH_ESTATE_REQUEST,
    assetId
  }
}

export function fetchEstateSuccess(estate) {
  return {
    type: FETCH_ESTATE_SUCCESS,
    estate
  }
}

export function fetchEstateFailure(id, error) {
  return {
    type: FETCH_ESTATE_FAILURE,
    id,
    error
  }
}

export const EDIT_ESTATE_PARCELS_REQUEST = '[Request] Edit Estate Parcels'
export const EDIT_ESTATE_PARCELS_SUCCESS = '[Success] Edit Estate Parcels'
export const EDIT_ESTATE_PARCELS_FAILURE = '[Failure] Edit Estate Parcels'

export function editEstateParcelsRequest(estate) {
  return {
    type: EDIT_ESTATE_PARCELS_REQUEST,
    estate
  }
}

export function editEstateParcelsSuccess(txHash, estate, parcels, type) {
  return {
    type: EDIT_ESTATE_PARCELS_SUCCESS,
    ...buildTransactionAction(txHash, {
      tx_hash: txHash,
      estate,
      type,
      parcels,
      asset_id: estate.asset_id
    }),
    actionType: type,
    estate,
    parcels
  }
}

export function editEstateParcelsFailure(error) {
  return {
    type: EDIT_ESTATE_PARCELS_FAILURE,
    error
  }
}

export const EDIT_ESTATE_METADATA_REQUEST = '[Request] Edit Estate Metadata'
export const EDIT_ESTATE_METADATA_SUCCESS = '[Success] Edit Estate Metadata'
export const EDIT_ESTATE_METADATA_FAILURE = '[Failure] Edit Estate Metadata'

export function editEstateMetadataRequest(estate) {
  return {
    type: EDIT_ESTATE_METADATA_REQUEST,
    estate
  }
}

export function editEstateMetadataSuccess(txHash, estate) {
  return {
    type: EDIT_ESTATE_METADATA_SUCCESS,
    ...buildTransactionAction(txHash, {
      estate: estate,
      tx_hash: txHash,
      asset_id: estate.asset_id
    }),
    estate
  }
}

export function editEstateMetadataFailure(error) {
  return {
    type: EDIT_ESTATE_METADATA_FAILURE,
    error
  }
}

export const DELETE_ESTATE_REQUEST = '[Request] Delete Estate'
export const DELETE_ESTATE_SUCCESS = '[Success] Delete Estate'
export const DELETE_ESTATE_FAILURE = '[Failure] Delete Estate'

export function deleteEstateRequest(estateId) {
  return {
    type: DELETE_ESTATE_REQUEST,
    estateId
  }
}

export function deleteEstateSuccess(txHash, estate) {
  return {
    type: DELETE_ESTATE_SUCCESS,
    ...buildTransactionAction(txHash, {
      estate: estate,
      tx_hash: txHash,
      asset_id: estate.asset_id
    }),
    estate
  }
}

export function deleteEstateFailure(error) {
  return {
    type: DELETE_ESTATE_FAILURE,
    error
  }
}

export const TRANSFER_ESTATE_REQUEST = '[Request] Transfer Estate'
export const TRANSFER_ESTATE_SUCCESS = '[Success] Transfer Estate'
export const TRANSFER_ESTATE_FAILURE = '[Failure] Transfer Estate'

export function transferEstateRequest(estate, to) {
  return {
    type: TRANSFER_ESTATE_REQUEST,
    estate,
    to
  }
}

export function transferEstateSuccess(txHash, transfer) {
  return {
    type: TRANSFER_ESTATE_SUCCESS,
    ...buildTransactionAction(txHash, transfer),
    estate: transfer.estate
  }
}

export function transferEstateFailure(error) {
  return {
    type: TRANSFER_ESTATE_FAILURE,
    error
  }
}
