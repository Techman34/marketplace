import { Publication } from '../src/Publication'

exports.up = pgm => {
  pgm.renameColumn(
    Publication.tableName,
    'marketplace_id',
    'marketplace_address'
  )
}
