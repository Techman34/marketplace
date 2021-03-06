import { connect } from 'react-redux'
import {
  getWallet,
  isConnecting as isWalletConnecting
} from 'modules/wallet/selectors'
import {
  isLoading as isAddressLoading,
  getData as getAddresses
} from 'modules/address/selectors'
import { getPublications } from 'modules/publication/selectors'

import Asset from './Asset'

const mapState = (state, { value, isConnected }) => {
  const wallet = getWallet(state)
  const addresses = getAddresses(state)

  let isConnecting = isWalletConnecting(state) || isAddressLoading(state)

  if (
    wallet &&
    wallet.address &&
    addresses[wallet.address] &&
    isConnected(addresses[wallet.address])
  ) {
    isConnecting = false
  }

  let publication = null
  let asset = value
  if (asset) {
    const publications = getPublications(state)
    publication = publications[asset.publication_tx_hash]
    asset = { ...asset, publication }
  }

  return {
    wallet,
    addresses,
    isConnecting,
    asset
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(Asset)
