const Joi = require('joi');

const getRecords = {
  query: Joi.object().keys({
    key: Joi.string(),
    value: Joi.string(),
    createdAt: Joi.string().isoDate(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAggregatedRecords = {
  body: Joi.object().keys({
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    minCount: Joi.number().integer().min(0).required(),
    maxCount: Joi.number().integer().greater(Joi.ref('minCount')).required(),
  }),
};

module.exports = {
  getRecords,
  getAggregatedRecords,
};
