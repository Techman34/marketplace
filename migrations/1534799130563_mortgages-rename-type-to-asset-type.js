import { Mortgage } from '../src/Mortgage'

exports.up = pgm => {
  pgm.renameColumn(Mortgage.tableName, 'type', 'asset_type')
}
