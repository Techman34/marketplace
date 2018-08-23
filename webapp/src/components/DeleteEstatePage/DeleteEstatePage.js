import React from 'react'
import PropTypes from 'prop-types'

import EstateModal from 'components/EstateDetailPage/EditEstateMetadata/EstateModal'
import Estate from 'components/Estate'
import { isNewEstate } from 'shared/estate'
import { t } from 'modules/translation/utils'

export default class DeleteEstatePage extends React.PureComponent {
  static props = {
    id: PropTypes.string.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  }

  render() {
    const { id, isTxIdle, onCancel, onConfirm } = this.props
    return (
      <Estate id={id} ownerOnly>
        {estate => (
          <React.Fragment>
            <EstateModal
              estate={estate}
              parcels={estate.data.parcels}
              title={t('estate_detail.delete')}
              subtitle={t('estate_detail.delete_desc', {
                estate_id: estate.id
              })}
              isTxIdle={isTxIdle}
              onCancel={onCancel}
              onConfirm={onConfirm}
              isDisabled={isNewEstate(estate)}
            />
          </React.Fragment>
        )}
      </Estate>
    )
  }
}
