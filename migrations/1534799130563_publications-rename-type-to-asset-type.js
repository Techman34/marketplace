import { Publication } from '../src/Publication'

exports.up = pgm => {
  pgm.renameColumn(Publication.tableName, 'type', 'asset_type')
}
