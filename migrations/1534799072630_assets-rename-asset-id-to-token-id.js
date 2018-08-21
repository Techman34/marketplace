import { Parcel } from '../src/Parcel'
import { Estate } from '../src/Estate'

exports.up = pgm => {
  pgm.renameColumn(Parcel.tableName, 'asset_id', 'token_id')
  pgm.renameColumn(Estate.tableName, 'asset_id', 'token_id')
}
