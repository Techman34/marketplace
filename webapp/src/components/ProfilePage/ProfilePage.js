import React from 'react'
import PropTypes from 'prop-types'

import { isFeatureEnabled } from 'lib/featureUtils'
import { PROFILE_PAGE_TABS } from 'locations'
import {
  Menu,
  Container,
  Card,
  Pagination,
  Loader,
  Label
} from 'semantic-ui-react'
import AddressBlock from 'components/AddressBlock'
import ParcelCard from 'components/ParcelCard'
import Contribution from './Contribution'
import { parcelType, contributionType, estateType } from 'components/types'
import { t } from 'modules/translation/utils'
import { buildUrl } from './utils'
import { shortenAddress, isBlacklistedAddress } from 'lib/utils'

import './ProfilePage.css'
import EstateCard from 'components/EstateCard'

export default class ProfilePage extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    parcels: PropTypes.arrayOf(parcelType),
    estates: PropTypes.arrayOf(estateType),
    contributions: PropTypes.arrayOf(contributionType),
    publishedParcels: PropTypes.arrayOf(parcelType),
    mortgagedParcels: PropTypes.arrayOf(parcelType),
    grid: PropTypes.arrayOf(
      PropTypes.oneOfType([parcelType, contributionType])
    ),
    tab: PropTypes.string,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    isLoading: PropTypes.bool,
    isEmpty: PropTypes.bool,
    isOwner: PropTypes.bool,
    isConnecting: PropTypes.bool,
    onNavigate: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { address, onAccessDenied } = this.props
    if (isBlacklistedAddress(address)) {
      onAccessDenied()
    }
    this.props.onFetchAddress()
  }

  handlePageChange = (event, data) => {
    const { address, tab, onNavigate } = this.props
    const url = buildUrl({
      page: data.activePage,
      address,
      tab
    })
    onNavigate(url)
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  renderEmpty() {
    const { tab } = this.props
    return (
      <div className="empty">
        <p>
          {t('profile_page.empty', {
            content: t(`global.${tab}`).toLowerCase()
          })}
        </p>
      </div>
    )
  }

  renderGrid() {
    const { grid, tab } = this.props
    switch (tab) {
      case PROFILE_PAGE_TABS.parcels: {
        return (
          <Card.Group stackable={true}>
            {grid.map(parcel => <ParcelCard key={parcel.id} parcel={parcel} />)}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.contributions: {
        return (
          <Card.Group stackable={true}>
            {grid.map(contribution => (
              <Contribution
                key={contribution.district_id}
                contribution={contribution}
              />
            ))}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.publications: {
        return (
          <Card.Group stackable={true}>
            {grid.map(parcel => (
              <ParcelCard
                key={parcel.id}
                parcel={parcel}
                isOwnerVisible={false}
              />
            ))}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.estates: {
        return (
          <Card.Group stackable={true}>
            {grid.map(estate => (
              <EstateCard key={estate.asset_id} estate={estate} />
            ))}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.mortgages: {
        return (
          <Card.Group stackable={true}>
            {grid.map(parcel => (
              <ParcelCard
                key={parcel.id}
                parcel={parcel}
                isOwnerVisible={false}
                showMortgage={true}
              />
            ))}
          </Card.Group>
        )
      }
      default:
        return null
    }
  }

  isActive(tab) {
    return tab === this.props.tab
  }

  renderBadge(array, tab) {
    if (array.length === 0) {
      return null
    }
    return (
      <Label className={this.isActive(tab) ? 'active' : ''} size="tiny">
        {array.length}
      </Label>
    )
  }

  handleItemClick = (event, { name }) => {
    const { address, onNavigate } = this.props
    const url = buildUrl({
      page: 1,
      address,
      tab: name
    })
    onNavigate(url)
  }

  render() {
    const {
      address,
      page,
      pages,
      isLoading,
      isEmpty,
      parcels,
      contributions,
      publishedParcels,
      estates,
      mortgagedParcels,
      isOwner,
      isConnecting
    } = this.props
    return (
      <div className="ProfilePage">
        {isOwner || isConnecting ? null : (
          <Container className="profile-header">
            <div>
              <AddressBlock scale={16} address={address} hasTooltip={false} />
              <span className="profile-address">{shortenAddress(address)}</span>
            </div>
          </Container>
        )}
        <Container className="profile-menu">
          <Menu pointing secondary stackable>
            <Menu.Item
              name={PROFILE_PAGE_TABS.parcels}
              active={this.isActive(PROFILE_PAGE_TABS.parcels)}
              onClick={this.handleItemClick}
            >
              {t('global.parcels')}
              {this.renderBadge(parcels, PROFILE_PAGE_TABS.parcels)}
            </Menu.Item>
            <Menu.Item
              name={PROFILE_PAGE_TABS.contributions}
              active={this.isActive(PROFILE_PAGE_TABS.contributions)}
              onClick={this.handleItemClick}
            >
              {t('global.contributions')}
              {this.renderBadge(contributions, PROFILE_PAGE_TABS.contributions)}
            </Menu.Item>
            <Menu.Item
              name={PROFILE_PAGE_TABS.publications}
              active={this.isActive(PROFILE_PAGE_TABS.publications)}
              onClick={this.handleItemClick}
            >
              {t('profile_page.on_sale')}
              {this.renderBadge(
                publishedParcels,
                PROFILE_PAGE_TABS.publications
              )}
            </Menu.Item>
            {isFeatureEnabled('ESTATES') && (
              <Menu.Item
                name={PROFILE_PAGE_TABS.estates}
                active={this.isActive(PROFILE_PAGE_TABS.estates)}
                onClick={this.handleItemClick}
              >
                {t('global.estates')}
                {this.renderBadge(estates, PROFILE_PAGE_TABS.estates)}
              </Menu.Item>
            ) /* Estate Feature */}
            {isFeatureEnabled('MORTGAGES') &&
              isOwner && (
                <Menu.Item
                  name={PROFILE_PAGE_TABS.mortgages}
                  active={this.isActive(PROFILE_PAGE_TABS.mortgages)}
                  onClick={this.handleItemClick}
                >
                  {t('global.mortgages')}
                  {this.renderBadge(
                    mortgagedParcels,
                    PROFILE_PAGE_TABS.mortgages
                  )}
                </Menu.Item>
              ) /* Mortgage Feature */}
          </Menu>
        </Container>
        <Container className="profile-grid">
          {isEmpty && !isLoading ? this.renderEmpty() : null}
          {isLoading ? this.renderLoading() : this.renderGrid()}
        </Container>
        <Container textAlign="center" className="pagination">
          {isEmpty || pages <= 1 ? null : (
            <Pagination
              activePage={page}
              firstItem={null}
              lastItem={null}
              prevItem={null}
              nextItem={null}
              pointing
              secondary
              totalPages={pages}
              onPageChange={this.handlePageChange}
              boundaryRange={1}
              siblingRange={1}
            />
          )}
        </Container>
      </div>
    )
  }
}
