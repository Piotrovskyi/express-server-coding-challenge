const request = require('supertest');

const app = require('../config/express');

describe('Global test', () => {
  test('Should response 200 for health endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
  });
});
