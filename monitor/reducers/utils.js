import { Parcel } from '../../src/Parcel'

export async function getParcelIdFromEvent(event) {
  const { assetId, landId } = event.args
  return Parcel.decodeTokenId(assetId || landId)
}
