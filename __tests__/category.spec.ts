import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../src/server';
import Utils from './utils';

const app = createServer();

const categoryPayload = {
  name: 'Mens Fashion'
};

const UpdateCategoryPayload = {
  name: 'Mens Fashion update'
};

describe('Category', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('testing category list', () => {
    it('get category list', async () => {
      const { status } = await supertest(app).get('/categories');
      expect(status).toBe(200);
    });
  });

  describe('testing category create', () => {
    describe('invalid category payload', () => {
      it('should return 422', async () => {
        const { status } = await supertest(app).post('/categories');
        expect(status).toBe(422);
      });
    });
    describe('fake category creation', () => {
      it('should return 201', async () => {
        const { status, body } = await supertest(app).post('/categories').send(categoryPayload);
        expect(status).toBe(201);
        expect(body).toEqual({
          data: {
            _id: expect.any(String),
            name: 'Mens Fashion',
            slug: 'mens-fashion'
          },
          status: 201,
          message: 'Success! Category created'
        });
      });
    });
    describe('superadmin category creation', () => {
      it('should return 201', async () => {
        const { status, body } = await supertest(app)
          .post('/categories')
          .send(categoryPayload)
          .set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(201);
        expect(body).toEqual({
          data: {
            products: [],
            _id: expect.any(String),
            name: 'Mens Fashion',
            slug: 'mens-fashion',
            __v: expect.any(Number)
          },
          status: 201,
          message: 'Success! Category created by admin'
        });
      });
    });
  });
  describe('testing category description', () => {
    it('should return 404', async () => {
      const { status } = await supertest(app).get('/categories/categoryId');
      expect(status).toBe(404);
    });
    it('should return 200', async () => {
      const { body } = await supertest(app).post('/categories').send(categoryPayload).set('Authorization', `Bearer ${Utils.access_token}`);
      const { status } = await supertest(app).get(`/categories/${body.data.slug}`);
      expect(status).toBe(200);
    });
  });
  describe('testing category update', () => {
    describe('fake category update', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/categories').send(categoryPayload);
        const { status, body } = await supertest(app).put(`/categories/${res.body.data.slug}`).send(UpdateCategoryPayload);
        expect(status).toBe(202);
        expect(body).toEqual({
          data: {
            _id: expect.any(String),
            name: 'Mens Fashion update',
            slug: 'mens-fashion',
            product: []
          },
          status: 202,
          message: 'Success! Category updated'
        });
      });
    });
    describe('super admin category update', () => {
      it('should return 202', async () => {
        const res = await supertest(app)
          .post('/categories')
          .send({ name: 'Mens cloths' })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        const { status, body } = await supertest(app)
          .put(`/categories/${res.body.data.slug}`)
          .send({ name: 'Mens cloths update' })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(202);
        expect(body).toEqual({
          status: 202,
          message: 'Success! User updated by admin',
          data: {
            products: [],
            _id: expect.any(String),
            name: 'Mens cloths update',
            slug: 'mens-cloths',
            __v: expect.any(Number),
            parent: null
          }
        });
      });
    });
  });

  describe('testing category destroy', () => {
    describe('fake category destroy', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/categories').send(categoryPayload);
        const { status } = await supertest(app).delete(`/categories/${res.body.data.slug}`);
        expect(status).toBe(202);
      });
    });
    describe('super admin category destroy', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/categories').send(categoryPayload).set('Authorization', `Bearer ${Utils.access_token}`);
        const { status } = await supertest(app)
          .delete(`/categories/${res.body.data.slug}`)
          .set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(202);
      });
    });
  });
});
