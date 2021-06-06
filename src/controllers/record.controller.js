const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { recordService } = require('../services');

const getRecords = catchAsync(async (req, res) => {
  const query = pick(req.query, ['key', 'value', 'createdAt']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await recordService.getRecords(query, options);
  res.send(result);
});

const getAggregatedRecords = catchAsync(async (req, res) => {
  const result = await recordService.getAggregatedRecords(req.body);
  res.send(result);
});

module.exports = {
  getRecords,
  getAggregatedRecords,
};
