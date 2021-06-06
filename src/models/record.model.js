const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const recordSchema = mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    index: true,
  },
  counts: {
    type: [Number],
    required: true,
  },
});

// add plugin that converts mongoose to json
recordSchema.plugin(toJSON);
recordSchema.plugin(paginate);

/**
 * @typedef Record
 */
const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
