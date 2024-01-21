import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../server';

const app = createServer();

// const categoryId = mongoose.Types.ObjectId().toString();

const userPayload = {
  name: 'Ron Bin Nawaz',
  email: 'ron@gmail.com',
  password: 'pass12345',
  password_repeat: 'pass12345'
};

describe('user', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('testing user list', () => {
    it('get all user', async () => {
      const { status } = await supertest(app).get('/users');
      expect(status).toBe(200);
    });
  });

  describe('testing user create', () => {
    describe('create user invalid payload', () => {
      it('should return 422', async () => {
        const { status } = await supertest(app).post('/users');
        expect(status).toBe(422);
      });
    });

    describe('fake user creation', () => {
      it('should return 201', async () => {
        const {status, body} = await supertest(app).post('/users').send(userPayload);
        expect(status).toBe(201);
        expect(body).toEqual({
          status: 201,
          message: 'User created',
          data: {
            access_token: expect.any(String),
            refresh_token: expect.any(String)
          }
        })
      });
    });
  });

  describe('testing single user', () => {
    
    describe('test get user', () => {
      it('should return 404', async () => {
        const { status } = await supertest(app).get(`/users/userID`);
        expect(status).toBe(404);
      });
      // it('should return 200', async () => {
      //   const { body } = await supertest(app).post('/users').send(userPayload);
      //   console.log('_id', body)
      //   const { status } = await supertest(app).get(`/users/${body._id}`);
      //   expect(status).toBe(200);
      // });
    })

  });
});
