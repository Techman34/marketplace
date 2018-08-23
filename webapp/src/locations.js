import { isParcel } from 'shared/parcel'

export const locations = {
  root: () => '/',

  // Addresses

  profilePageDefault: (address = ':address', tab = PROFILE_PAGE_TABS.parcels) =>
    locations.profilePage(address, PROFILE_PAGE_TABS.parcels),

  profilePage: (address = ':address', tab = ':tab') =>
    `/address/${address}/${tab}`,

  // Parcels

  parcelMapDetail: (x = ':x', y = ':y', marker = '') =>
    `/${x}/${y}` + (marker ? `?marker=${marker}` : ''),

  parcelDetail: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/detail`,

  sellParcel: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/sell`,
  buyParcel: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/buy`,
  cancelSaleParcel: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/cancel-sale`,

  editParcel: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/edit`,
  manageParcel: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/manage`,
  transferParcel: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/transfer`,

  createEstate: (x = ':x', y = ':y') => `(/parcels)?/${x}/${y}/create-estate`, // this could be /estates/create once it's parcel independent

  // Estates

  estateDetail: (tokenId = ':tokenId') => `/estates/${tokenId}/detail`,

  ediEstateParcels: (tokenId = ':tokenId') =>
    `/estates/${tokenId}/edit-parcels`,
  ediEstateMetadata: (tokenId = ':tokenId') =>
    `/estates/${tokenId}/edit-metadata`,

  deleteEstate: (tokenId = ':tokenId') => `/estates/${tokenId}/delete-estate`,

  // Generic assets

  assetDetail: function(asset) {
    return isParcel(asset)
      ? this.parcelDetail(asset.x, asset.y)
      : this.estateDetail(asset.tokenId)
  },

  // Mortgages

  buyParcelByMortgage: (x = ':x', y = ':y') => `/mortgages/${x}/${y}/buy`,
  payMortgageParcel: (x = ':x', y = ':y') => `/mortgages/${x}/${y}/pay`,

  // General routes

  marketplace: () => '/marketplace',

  buyMana: () => '/buy-mana',
  transferMana: () => '/transfer-mana',

  settings: () => '/settings',
  activity: () => '/activity',

  colorKey: () => '/colorKey',
  privacy: () => '/privacy',
  terms: () => '/terms',

  signIn: () => '/sign-in'
}

export const STATIC_PAGES = [
  locations.root(),
  locations.privacy(),
  locations.terms()
]

export const PROFILE_PAGE_TABS = Object.freeze({
  parcels: 'parcels',
  contributions: 'contributions',
  publications: 'publications',
  estates: 'estates',
  mortgages: 'mortgages'
})

export const NAVBAR_PAGES = Object.freeze({
  atlas: 'Atlas',
  marketplace: 'Marketplace',
  activity: 'Activity',
  profile: 'My Land',
  settings: 'Settings',
  signIn: 'Sign In'
})
