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

describe('auth', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('testing Registration', () => {
    it('Invalid email! should return 422', async () => {
      const { status } = await supertest(app).post('/auth/register').send({...userPayload, email: 'invalid-email'});
      expect(status).toBe(422);
    });
    it('password not match! should return 422', async () => {
      const { status } = await supertest(app).post('/auth/register').send({...userPayload, password_repeat: 'not-match-password'});
      expect(status).toBe(422);
    });
    it('password not match! should return 201', async () => {
      const { status, body } = await supertest(app).post('/auth/register').send(userPayload);
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

  describe('testing login', () => {
    it('user not found! should return 400', async () => {
      const { status, body } = await supertest(app).post('/auth/login').send({ email: userPayload.email, password: userPayload.password });
      expect(status).toBe(400);
      expect(body).toEqual({
        message: 'User is not found',
        status: 400
      });
    });
    it('wrong password! should return 400', async () => {
      await supertest(app).post('/users').send(userPayload).set('Authorization', `Bearer ${Utils.access_token}`);
      const { status, body } = await supertest(app).post('/auth/login').send({ email: userPayload.email, password: "Invlid Password" });
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Your password is wrong",
        status: 400
      });
    });
    it('success login! should return 200', async () => {
      const { status, body } = await supertest(app).post('/auth/login').send({ email: userPayload.email, password: userPayload.password });
      expect(status).toBe(200);
      expect(body).toEqual({
        data: {
          access_token: expect.any(String),
          refresh_token: expect.any(String)
        },
        message: 'Sign in success',
        status: 200
      });
    });
  });

  describe('testing refresh tokens', () => {
    it('invlid refresh token! should return 401', async () => {
      const { status } = await supertest(app).post('/auth/refresh').send({ refresh_token: "Invalid Token"});
      expect(status).toBe(401);
    });
    it('valid refresh token! should return 201', async () => {
      const loginRes = await supertest(app).post('/auth/login').send({ email: userPayload.email, password: userPayload.password });
      const { status, body } = await supertest(app).post('/auth/refresh').send({ refresh_token: loginRes.body.data.refresh_token });
      expect(status).toBe(201);
      expect(body).toEqual({
        status: 201,
        message: 'Success! New tokens created',
        data: {
          access_token: expect.any(String),
          refresh_token: expect.any(String)
        }
      });
    });
  });
});
