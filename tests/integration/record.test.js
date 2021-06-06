const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { Record } = require('../../src/models');
const setupTestDB = require('../utils/setupTestDB');

const rawRecords = [
  {
    key: faker.datatype.uuid(),
    value: faker.datatype.uuid(),
    createdAt: new Date('2015-05-09T16:58:34.137Z'),
    counts: [1464, 378, 1702],
  },
  {
    key: faker.datatype.uuid(),
    value: faker.datatype.uuid(),
    createdAt: new Date('2016-12-03T05:45:03.605Z'),
    counts: [1472, 521, 1932],
  },
  {
    key: faker.datatype.uuid(),
    value: faker.datatype.uuid(),
    createdAt: new Date('2016-12-27T03:12:14.477Z'),
    counts: [2, 1340, 651],
  },
];

setupTestDB();

describe('Record routes', () => {
  let records;

  beforeEach(async () => {
    records = await Record.insertMany(rawRecords).then((res) => res.map((r) => r.toJSON()));
  });

  describe('GET /v1/records', () => {
    test('should return 200 and apply the default query options', async () => {
      const res = await request(app).get('/v1/records').send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
    });

    ['key', 'value', 'createdAt'].forEach((key) => {
      test(`should correctly apply filter on ${key} field`, async () => {
        const res = await request(app)
          .get('/v1/records')
          .query({ [key]: records[0][key] })
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 10,
          totalPages: 1,
          totalResults: 1,
        });
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0].id).toBe(records[0].id);
      });
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      const res = await request(app).get('/v1/records').query({ sortBy: 'key:desc' }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });

      expect(res.body.results).toHaveLength(3);

      let isDescendingSorted = true;

      for (let i = 0; i < res.body.results.length - 1; i += 1) {
        const result = res.body.results[i];
        const nextResult = res.body.results[i + 1];

        if (result.key < nextResult.key) {
          isDescendingSorted = false;
        }
      }

      expect(isDescendingSorted).toBe(true);
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      const res = await request(app).get('/v1/records').query({ sortBy: 'key:asc' }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });

      expect(res.body.results).toHaveLength(3);

      let isAscendingSorted = true;

      for (let i = 0; i < res.body.results.length - 1; i += 1) {
        const result = res.body.results[i];
        const nextResult = res.body.results[i + 1];

        if (result.key > nextResult.key) {
          isAscendingSorted = false;
        }
      }

      expect(isAscendingSorted).toBe(true);
    });

    test('should limit returned array if limit param is specified', async () => {
      const res = await request(app).get('/v1/records').query({ limit: 2 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(records[0].id);
      expect(res.body.results[1].id).toBe(records[1].id);
    });

    test('should return the correct page if page and limit params are specified', async () => {
      const res = await request(app).get('/v1/records').query({ page: 2, limit: 2 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(records[2].id);
    });
  });

  describe('POST /v1/records', () => {
    test('should return 200 and the aggregated records', async () => {
      const res = await request(app)
        .post('/v1/records')
        .send({ startDate: '2015-05-09', endDate: '2016-12-03', minCount: 2000, maxCount: 3545 })
        .expect(httpStatus.OK);

      expect(res.body.length).toEqual(1);
      expect(res.body[0].key).toEqual(rawRecords[0].key);
      expect(res.body[0].totalCount).toEqual(rawRecords[0].counts.reduce((a, v) => a + v, 0));
    });
  });
});
