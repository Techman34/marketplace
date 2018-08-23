import React from 'react'
import PropTypes from 'prop-types'
import { Header, Grid, Container, Button } from 'semantic-ui-react'

import AssetDetailPage from 'components/AssetDetailPage'
import ParcelCard from 'components/ParcelCard'
import EstateActions from './EstateActions'
import { t } from 'modules/translation/utils'
import { buildCoordinate } from 'shared/parcel'
import { estateType, parcelType } from 'components/types'
import './EstateDetail.css'

export default class EstateDetail extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    allParcels: PropTypes.objectOf(parcelType),
    isOwner: PropTypes.bool.isRequired,
    onViewAssetClick: PropTypes.func.isRequired,
    onEditParcels: PropTypes.func.isRequired,
    onEditMetadata: PropTypes.func.isRequired
  }

  render() {
    const {
      estate,
      isOwner,
      allParcels,
      onViewAssetClick,
      onEditParcels,
      onEditMetadata
    } = this.props
    const { parcels } = estate.data

    return (
      <div className="EstateDetail">
        <div className="parcel-preview" title={t('parcel_detail.view')}>
          <AssetDetailPage asset={estate} onAssetClick={onViewAssetClick} />
        </div>
        <Container>
          <Grid className="details">
            <Grid.Row>
              <Grid.Column width={8} className={'parcels'}>
                <Header size="large">
                  <p className="estate-title">
                    {estate.data.name || t('estate_select.detail')}
                  </p>
                  {estate.data.description && (
                    <p className="estate-description">
                      {estate.data.description}
                    </p>
                  )}
                </Header>
              </Grid.Column>
              {isOwner && (
                <Grid.Column className="parcel-actions-container" computer={8}>
                  <EstateActions onEditMetadata={onEditMetadata} />
                </Grid.Column>
              )}
              {allParcels && (
                <React.Fragment>
                  <Grid.Column
                    width={8}
                    className={'selected-parcels-headline'}
                  >
                    <p className="parcels-included">
                      {t('estate_detail.parcels')}
                    </p>
                  </Grid.Column>
                  {isOwner && (
                    <Grid.Column
                      width={8}
                      className={'selected-parcels-headline'}
                    >
                      <Button
                        size="tiny"
                        className="link"
                        onClick={onEditParcels}
                      >
                        {t('estate_detail.edit_parcels')}{' '}
                      </Button>
                    </Grid.Column>
                  )}
                  <Grid.Column width={16} className={'selected-parcels'}>
                    {parcels.map(({ x, y }) => {
                      const parcel = allParcels[buildCoordinate(x, y)]
                      return parcel ? (
                        <ParcelCard
                          key={parcel.id}
                          parcel={parcel}
                          withMap={false}
                        />
                      ) : null
                    })}
                  </Grid.Column>
                </React.Fragment>
              )}
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }
}
