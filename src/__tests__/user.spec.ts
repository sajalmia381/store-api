import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../server';
import Utils from './utils';

const app = createServer();

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
    describe('invalid user payload', () => {
      it('should return 422', async () => {
        const { status } = await supertest(app).post('/users');
        expect(status).toBe(422);
      });
    });
    describe('fake user creation', () => {
      it('should return 201', async () => {
        const { status, body } = await supertest(app).post('/users').send(userPayload);
        expect(status).toBe(201);
        expect(body).toEqual({
          status: 201,
          message: 'Success! User created',
          data: {
            _id: expect.any(String),
            email: 'ron@gmail.com',
            name: 'Ron Bin Nawaz',
            password: 'pass12345',
            role: 'ROLE_CUSTOMER'
          }
        });
      });
    });
    describe('super admin user creation', () => {
      it('should return 201', async () => {
        const { status, body } = await supertest(app).post('/users').send(userPayload).set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(201);
        expect(body).toEqual({
          status: 201,
          message: 'Success! User created by admin',
          data: {
            _id: expect.any(String),
            email: 'ron@gmail.com',
            name: 'Ron Bin Nawaz',
            password: expect.any(String),
            role: 'ROLE_CUSTOMER',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: expect.any(Number)
          }
        });
      });
    });
  });

  describe('testing single user', () => {
    describe('test get user', () => {
      it('should return 404', async () => {
        const { status } = await supertest(app).get(`/users/userID`);
        expect(status).toBe(404);
      });
      it('should return 200', async () => {
        const res = await supertest(app)
          .post('/users')
          .send({ ...userPayload, email: 'ron2@gmail.com' })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        const { status } = await supertest(app).get(`/users/${res.body.data._id}`);
        expect(status).toBe(200);
      });
    });
  });

  describe('testing user update', () => {
    describe('fake user update', () => {
      it('should return 202', async () => {
        const res = await supertest(app)
          .post('/users')
          .send({ ...userPayload, email: 'ron3@gmail.com' })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        const { status, body } = await supertest(app).put(`/users/${res.body.data._id}`).send({
          name: 'Ron Bin Nawaz update',
          number: 12025550108
        });
        expect(status).toBe(202);
        expect(body).toEqual({
          status: 202,
          message: 'Success! User updated',
          data: {
            name: 'Ron Bin Nawaz update',
            email: 'ron3@gmail.com',
            number: 12025550108,
            role: 'ROLE_CUSTOMER'
          }
        });
      });
    });
    describe('super admin product update', () => {
      it('should return 202', async () => {
        const res = await supertest(app)
          .post('/users')
          .send({ ...userPayload, email: 'ron34@gmail.com' })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        const { status, body } = await supertest(app)
          .put(`/users/${res.body.data._id}`)
          .send({
            name: 'Ron Bin Nawaz update',
            number: 12025550108
          })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(202);
        expect(body).toEqual({
          status: 202,
          message: 'Success! User updated by admin',
          data: {
            role: res.body.data.role,
            _id: res.body.data._id,
            name: 'Ron Bin Nawaz update',
            email: res.body.data.email,
            password: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: expect.any(Number),
            number: 12025550108
          }
        });
      });
    });
  });

  describe('testing user destroy', () => {
    describe('fake user destroy', () => {
      it('should return 202', async () => {
        const res = await supertest(app)
          .post('/users')
          .send({ ...userPayload, email: 'ron4@gmail.com' })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        const { status } = await supertest(app).delete(`/users/${res.body.data._id}`);
        expect(status).toBe(202);
      });
    });
    describe('super admin user destroy', () => {
      it('should return 202', async () => {
        const res = await supertest(app)
          .post('/users')
          .send({ ...userPayload, email: 'ron5@gmail.com' })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        const { status } = await supertest(app).delete(`/users/${res.body.data._id}`).set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(202);
      });
    });
  });
});
