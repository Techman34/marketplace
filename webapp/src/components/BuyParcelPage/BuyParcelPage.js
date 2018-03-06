import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Header, Grid, Button, Message } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import ParcelName from 'components/ParcelName'
import Parcel from 'components/Parcel'
import { walletType } from 'components/types'
import { locations } from 'locations'

import './BuyParcelPage.css'

export default class BuyParcelPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    x: PropTypes.isRequired,
    y: PropTypes.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  render() {
    const { wallet, x, y, publication, isDisabled, onCancel } = this.props
    const { approvedBalance } = wallet

    const isNotEnough = publication && approvedBalance < +publication.price

    return (
      <div className="BuyParcelPage">
        <Navbar />
        <Parcel x={x} y={y}>
          {parcel => (
            <React.Fragment>
              <Container text textAlign="center">
                <Header as="h2" size="huge" className="title">
                  Buy LAND
                </Header>
                <span className="subtitle">
                  You are about to buy&nbsp;
                  <ParcelName parcel={parcel} />{' '}
                  {publication ? (
                    <React.Fragment>
                      for{' '}
                      <strong className="price">
                        {(+publication.price).toLocaleString()} MANA
                      </strong>
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </span>
              </Container>
              <br />
              <Container text>
                <Grid.Column className="text-center">
                  <Button onClick={onCancel} type="button">
                    Cancel
                  </Button>
                  <Button
                    onClick={this.handleConfirm}
                    type="button"
                    primary
                    disabled={isDisabled || isNotEnough}
                  >
                    Confirm
                  </Button>
                </Grid.Column>
              </Container>
              <br />
              {isNotEnough ? (
                <Container text>
                  <Grid.Column>
                    <Message warning>
                      {approvedBalance > 0 ? (
                        <React.Fragment>
                          <h3>
                            <strong>
                              Your approved balance is{' '}
                              {approvedBalance.toLocaleString()} MANA
                            </strong>
                          </h3>
                          You need at least{' '}
                          <strong className="price">
                            {(+publication.price).toLocaleString()} MANA
                          </strong>{' '}
                          in order to buy this LAND.
                          <br />
                          Please go to{' '}
                          <Link to={locations.settings}>Settings</Link> and
                          approve some more MANA.
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <h3>
                            <strong>You haven&apos;t approved MANA</strong>
                          </h3>
                          You need to approve MANA to be used by the Marketplace
                          before you can buy LAND.
                          <br />
                          Please go to{' '}
                          <Link to={locations.settings}>Settings</Link> and
                          approve some more MANA.
                        </React.Fragment>
                      )}
                    </Message>
                  </Grid.Column>
                </Container>
              ) : null}
            </React.Fragment>
          )}
        </Parcel>
      </div>
    )
  }
}
