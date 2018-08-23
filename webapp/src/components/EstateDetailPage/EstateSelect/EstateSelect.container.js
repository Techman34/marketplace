import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getData as getParcels } from 'modules/parcels/selectors'
import {
  getData as getEstates,
  isEstateTransactionIdle
} from 'modules/estates/selectors'
import EstateSelect from 'components/EstateDetailPage/EstateSelect/EstateSelect'

const mapState = (state, ownProps) => {
  const { tokenId } = getMatchParams(ownProps)
  const estates = getEstates(state)

  return {
    allParcels: getParcels(state),
    pristineEstate: estates[tokenId],
    isTxIdle: isEstateTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y, tokenId } = getMatchParams(ownProps)

  return {
    onError: () => dispatch(navigateTo(locations.root())),
    onCreateCancel: () => dispatch(navigateTo(locations.parcelDetail(x, y))),
    onDeleteEstate: () => dispatch(navigateTo(locations.deleteEstate(tokenId)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateSelect))
