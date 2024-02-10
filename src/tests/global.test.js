const request = require('supertest');

const app = require('../config/express');

describe('Global test', () => {
  test('Should response 200 for health endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
  });

  test('Should response 404 if route not found', async () => {
    const response = await request(app).get('/api/not-exist');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
  });
});
