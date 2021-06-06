const { Record } = require('../models');

/**
 * Query for records
 * @param {Object} query - Mongo query
 * @param {string} [query.createdAt] - Created date option in the format: YYYY-MM-DD
 * @param {string} [query.key] - Key
 * @param {string} [query.value] - Value
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getRecords = async (query, options) => {
  const records = await Record.paginate(query, options);
  return records;
};

/**
 * Query for aggregated records
 * @param {Object} query - Mongo query
 * @param {string} [query.startDate] - Start date option in the format: YYYY-MM-DD
 * @param {string} [query.endDate] - End date option in the format: YYYY-MM-DD
 * @param {number} [query.minCount] - Minimum count
 * @param {number} [query.maxCount] - Maximum count
 * @returns {Promise<QueryResult>}
 */
const getAggregatedRecords = async (query) => {
  const createdAt = {
    $match: {
      createdAt: {
        $gte: new Date(query.startDate),
        $lt: new Date(query.endDate),
      },
    },
  };

  const totalCount = [
    {
      $addFields: {
        totalCount: {
          $reduce: {
            input: '$counts',
            initialValue: 0,
            in: { $add: ['$$value', '$$this'] },
          },
        },
      },
    },
    {
      $match: {
        totalCount: {
          $gte: query.minCount,
          $lte: query.maxCount,
        },
      },
    },
  ];

  const project = {
    $project: {
      _id: 0,
      key: 1,
      createdAt: 1,
      totalCount: 1,
    },
  };

  const records = await Record.aggregate([createdAt, ...totalCount, project]);

  return records;
};

module.exports = {
  getRecords,
  getAggregatedRecords,
};
