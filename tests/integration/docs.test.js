const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/docs', () => {
  test('should return API doc', async () => {
    await request(app).get('/v1/docs').expect('Content-Type', /html/);
  });
});
