const request = require('supertest');

const app = require('../config/express');
const { sequelize } = require('../config/db');

beforeEach(async () => {
  await sequelize.drop();
  await sequelize.sync();
});

describe('Art API', () => {
  test('Should get all arts', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
      { title: 'Art 2', artist: 'Picasso', year: 2022 },
    ]);

    const response = await request(app).get('/api/art');

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(2);

    expect(response.body.data[0].title).toBe('Art 1');
    expect(response.body.data[0].artist).toBe('Van Gog');
    expect(response.body.data[0].year).toBe(2021);

    expect(response.body.pageInfo).toBeDefined();
    expect(response.body.pageInfo.totalItems).toBe(2);
    expect(response.body.pageInfo.currentPage).toBe(1);
    expect(response.body.pageInfo.totalPages).toBe(1);
    expect(response.body.pageInfo.limit).toBe(20);
  });

  test('Should get art by id', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
    ]);

    const response = await request(app).get('/api/art/1');

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.title).toBe('Art 1');
    expect(response.body.data.artist).toBe('Van Gog');
    expect(response.body.data.year).toBe(2021);
  });

  test('Should fail if id not exist', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
    ]);

    const response = await request(app).get('/api/art/2');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeNull();
  });

  test('Should create art post as a guest user', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
    ]);

    const response = await request(app).post('/api/art/1/comments').send({
      name: 'John',
      content: 'Great art',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe('John');
    expect(response.body.data.content).toBe('Great art');
    expect(response.body.data.artID).toBe(1);
  });

  test('Should fail on comment creation if guest user use name twice', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
    ]);

    const response = await request(app).post('/api/art/1/comments').send({
      name: 'John',
      content: 'Great art',
    });

    expect(response.statusCode).toBe(201);

    const response2 = await request(app).post('/api/art/1/comments').send({
      name: 'John',
      content: 'Great art',
    });

    expect(response2.statusCode).toBe(400);
    expect(response2.body.message).toBeDefined();
    expect(response2.body.data).toBeNull();
  });

  test('Should fail on comment creation if art not exist', async () => {
    const response = await request(app).post('/api/art/1/comments').send({
      name: 'John',
      content: 'Great art',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeNull();
  });

  test('Should fail on comment creation if name not passed', async () => {
    const response = await request(app).post('/api/art/1/comments').send({
      content: 'Great art',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.name).toBe('ValidationError');
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.details.body).toBeDefined();
    expect(response.body.details.body[0].message).toBe('"name" is required');
  });

  test('Should fail on comment creation if content not passed', async () => {
    const response = await request(app).post('/api/art/1/comments').send({
      name: 'John',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.name).toBe('ValidationError');
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.details.body).toBeDefined();
    expect(response.body.details.body[0].message).toBe('"content" is required');
  });

  test('Should create comment successfully if userID passed', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
    ]);
    await sequelize.models.User.bulkCreate([
      { name: 'John', age: 18, location: 'Lagos, Nigeria' },
    ]);
    const response = await request(app).post('/api/art/1/comments').send({
      userID: 1,
      content: 'Great art',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe('John');
    expect(response.body.data.content).toBe('Great art');
    expect(response.body.data.artID).toBe(1);
    expect(response.body.data.userID).toBe(1);
  });

  test(
    'Should create comment successfully if non guest user create comment multiple times',
    async () => {
      await sequelize.models.Art.bulkCreate([
        { title: 'Art 1', artist: 'Van Gog', year: 2021 },
      ]);
      await sequelize.models.User.bulkCreate([
        { name: 'John', age: 18, location: 'Lagos, Nigeria' },
      ]);
      const response = await request(app).post('/api/art/1/comments').send({
        userID: 1,
        content: 'Great art',
      });

      expect(response.statusCode).toBe(201);
      const response2 = await request(app).post('/api/art/1/comments').send({
        userID: 1,
        content: 'Great art 2',
      });
      expect(response2.statusCode).toBe(201);
    },
  );

  test('Should ignore custom name if userID passed', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
    ]);
    await sequelize.models.User.bulkCreate([
      { name: 'John', age: 18, location: 'Lagos, Nigeria' },
    ]);

    const response = await request(app).post('/api/art/1/comments').send({
      userID: 1,
      name: 'Should not be this name',
      content: 'Great art',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.name).toBe('John');
    expect(response.body.data.content).toBe('Great art');
    expect(response.body.data.artID).toBe(1);
    expect(response.body.data.userID).toBe(1);
  });

  test('Should fail on comment creation if user not exist', async () => {
    await sequelize.models.Art.bulkCreate([
      { title: 'Art 1', artist: 'Van Gog', year: 2021 },
    ]);

    const response = await request(app).post('/api/art/1/comments').send({
      userID: 2,
      content: 'Great art',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeNull();
  });
});
