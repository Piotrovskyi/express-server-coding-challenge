const request = require('supertest');

const app = require('../config/express');
const { sequelize } = require('../config/db');

beforeEach(async () => {
  await sequelize.drop();
  await sequelize.sync();
});

describe('Users API', () => {
  test('Should create user successfully', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'John',
      age: 18,
      location: 'Lagos, Nigeria',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe('John');
    expect(response.body.data.age).toBe(18);
    expect(response.body.data.location).toBe('Lagos, Nigeria');
  });

  test('Should fail with error if create with no name', async () => {
    const response = await request(app).post('/api/users').send({
      age: 18,
      location: 'Lagos, Nigeria',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.name).toBe('ValidationError');
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.details.body).toBeDefined();
    expect(response.body.details.body[0].message).toBe('"name" is required');
  });

  test('Should fail with error if create with no age', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'John',
      location: 'Lagos, Nigeria',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.name).toBe('ValidationError');
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.details.body).toBeDefined();
    expect(response.body.details.body[0].message).toBe('"age" is required');
  });

  test('Should fail with error if create with no location', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'John',
      age: 18,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.name).toBe('ValidationError');
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.details.body).toBeDefined();
    expect(response.body.details.body[0].message).toBe('"location" is required');
  });

  test('Should successfully get users from empty table', async () => {
    const response = await request(app).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.pageInfo).toBeDefined();
    expect(response.body.pageInfo.totalItems).toBe(0);
    expect(response.body.pageInfo.currentPage).toBe(1);
    expect(response.body.pageInfo.totalPages).toBe(0);
    expect(response.body.pageInfo.limit).toBe(20);
  });

  test('Should successfully get users', async () => {
    await sequelize.models.User.bulkCreate([
      { name: 'John', age: 18, location: 'Lagos, Nigeria' },
      { name: 'Jane', age: 20, location: 'Nairobi, Kenya' },
      { name: 'Joe', age: 22, location: 'Kampala, Uganda' },
    ]);

    const response = await request(app).get('/api/users');

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(3);

    expect(response.body.data[0].id).toBe(1);
    expect(response.body.data[0].name).toBe('John');
    expect(response.body.data[0].age).toBe(18);
    expect(response.body.data[0].location).toBe('Lagos, Nigeria');

    expect(response.body.pageInfo).toBeDefined();
    expect(response.body.pageInfo.totalItems).toBe(3);
    expect(response.body.pageInfo.currentPage).toBe(1);
    expect(response.body.pageInfo.totalPages).toBe(1);
    expect(response.body.pageInfo.limit).toBe(20);
  });
});
