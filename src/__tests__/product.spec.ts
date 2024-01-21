import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../server';
import JwtService from '../services/JwtService';

const app = createServer();

const categoryId = mongoose.Types.ObjectId().toString();
const userId = mongoose.Types.ObjectId().toString();

const productPayload = {
  title: 'Men Boxer Sneakers For Men  (Black)',
  price: 799,
  description: 'Lorem Ipsum is simply dummy text of the printing',
  category: categoryId,
  createdBy: userId
};

const UpdateProductPayload = {
  title: 'Men Boxer Sneakers For Men update',
  price: 999,
  description: 'update',
  category: categoryId,
};

const superAdminJWTPayload = {
  name: 'User Admin',
  email: 'useradmin@gmail.com',
  role: 'ROLE_SUPER_ADMIN'
}

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('testing product list', () => {
    it('get product list', async () => {
      const { status, body } = await supertest(app).get('/products');
      expect(status).toBe(200);
    });
    it('get pagination product list', async () => {
      const { status, body } = await supertest(app).get('/products?limit=10&page=1');
      console.log(body)
      expect(status).toBe(200);
      expect(body).toEqual({
        metadata: { currentPage: 1, totalProducts: 0, totalPages: 1 },
        data: [],
        status: 200,
        message: 'Success! Prodcut List.'
      })
    });
  });

  describe('testing product create', () => {
    describe('invalid product payload', () => {
      it('should return 422', async () => {
        const { status } = await supertest(app).post('/products');
        expect(status).toBe(422);
      });
    });
    describe('fake product creation', () => {
      it('should return 201', async () => {
        const { status } = await supertest(app).post('/products').send(productPayload);
        expect(status).toBe(201);
      });
    });
    describe('superadmin product creation', () => {
      it('should return 201', async () => {
        const token = JwtService.sign(superAdminJWTPayload)
        const { status, body } = await supertest(app).post('/products').send(productPayload).set("Authorization", `Bearer ${token}`);
        expect(status).toBe(201);
        expect(body).toEqual({
          data: {
            _id: expect.any(String),
            title: 'Men Boxer Sneakers For Men  (Black)',
            price: 799,
            category: expect.any(String),
            description: 'Lorem Ipsum is simply dummy text of the printing',
            imageSource: null,
            createdBy: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            slug: 'men-boxer-sneakers-for-men-(black)',
            __v: expect.any(Number)
          },
          status: 201,
          message: 'Success! product created by admin'
        })
      });
    });
  });
  describe('testing product description', () => {
    it('should return 404', async () => {
      const { status } = await supertest(app).get('/products/productID');
      expect(status).toBe(404);
    });
    it('should return 200', async () => {
      const token = JwtService.sign(superAdminJWTPayload)
      const { body } = await supertest(app).post('/products').send(productPayload).set("Authorization", `Bearer ${token}`);
      const { status } = await supertest(app).get(`/products/${body.data.slug}`);
      expect(status).toBe(200);
    });
  });
  describe('testing product update', () => {
    describe('fake product update', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/products').send(productPayload);
        const { status, body } = await supertest(app).put(`/products/${res.body.data.slug}`).send(UpdateProductPayload);
        expect(status).toBe(202);
        expect(body).toEqual({
          data: {
            _id: expect.any(String),
            title: 'Men Boxer Sneakers For Men update',
            price: 999,
            category: expect.any(String),
            description: 'update',
            createdBy: res.body.data.createdBy,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            slug: 'men-boxer-sneakers-for-men-update'
          },
          status: 202,
          message: 'Success! product updated'
        })
      });
    })
    describe('super admin product update', () => {
      it('should return 202', async () => {
        const token = JwtService.sign(superAdminJWTPayload)
        const res = await supertest(app).post('/products').send(productPayload).set("Authorization", `Bearer ${token}`);
        const { status, body } = await supertest(app).put(`/products/${res.body.data.slug}`).send(UpdateProductPayload).set("Authorization", `Bearer ${token}`);
        expect(status).toBe(202);
        expect(body).toEqual({
          data: {
            _id: res.body.data._id,
            title: 'Men Boxer Sneakers For Men update',
            price: 999,
            category: expect.any(String),
            description: 'update',
            imageSource: res.body.data.imageSource,
            createdBy: res.body.data.createdBy,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            slug: res.body.data.slug,
            __v: expect.any(Number),
          },
          status: 202,
          message: 'Success! product updated by admin'
        })
      });
    })
  });

  describe('testing product destroy', () => {
    describe('fake product destroy', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/products').send(productPayload);
        const { status } = await supertest(app).delete(`/products/${res.body.data.slug}`);
        expect(status).toBe(202);
      });
    })
    describe('super admin product destroy', () => {
      it('should return 202', async () => {
        const token = JwtService.sign(superAdminJWTPayload)
        const res = await supertest(app).post('/products').send(productPayload).set("Authorization", `Bearer ${token}`);
        const { status, body } = await supertest(app).delete(`/products/${res.body.data.slug}`).send(UpdateProductPayload).set("Authorization", `Bearer ${token}`);
        expect(status).toBe(202);
      });
    })
  });
});
