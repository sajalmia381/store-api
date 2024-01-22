import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../server';
import Utils from './utils';

const app = createServer();

describe('cart', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('testing cart list', () => {
    it('get all cart', async () => {
      const { status } = await supertest(app).get('/carts');
      expect(status).toBe(200);
    });
  });

  // describe('testing cart create', () => {
  //   describe('invalid cart payload', () => {
  //     it('should return 422', async () => {
  //       const { status } = await supertest(app).post('/carts');
  //       expect(status).toBe(422);
  //     });
  //   });
  //   describe('fake cart creation', () => {
  //     it('should return 201', async () => {
  //       const { status, body } = await supertest(app).post('/carts').send(cartPayload);
  //       expect(status).toBe(201);
  //       // console.log('body', body);
  //       expect(body).toEqual({
  //         status: 201,
  //         message: 'Success! cart created',
  //         data: {
  //           _id: expect.any(String),
  //           completed: false,
  //           createdBy: expect.any(String),
  //           description: 'Some description',
  //           status: 'cart',
  //           title: 'Conduct code reviews regularly'
  //         }
  //       });
  //     });
  //   });
  //   describe('super admin cart creation', () => {
  //     it('should return 201', async () => {
  //       const { status, body } = await supertest(app).post('/carts').send(cartPayload).set('Authorization', `Bearer ${Utils.access_token}`);
  //       expect(status).toBe(201);
  //       expect(body).toEqual({
  //         status: 201,
  //         message: 'Success! cart created by admin',
  //         data: {
  //           __v: expect.any(Number),
  //           _id: expect.any(String),
  //           completed: false,
  //           createdBy: expect.any(String),
  //           description: 'Some description',
  //           status: 'cart',
  //           title: 'Conduct code reviews regularly',
  //           createdAt: expect.any(String),
  //           updatedAt: expect.any(String)
  //         }
  //       });
  //     });
  //   });
  // });

  // describe('testing single cart', () => {
  //   describe('test get cart', () => {
  //     it('should return 404', async () => {
  //       const { status } = await supertest(app).get(`/carts/cartID`);
  //       expect(status).toBe(404);
  //     });
  //     it('should return 200', async () => {
  //       const res = await supertest(app)
  //         .post('/carts')
  //         .send(cartPayload)
  //         .set('Authorization', `Bearer ${Utils.access_token}`);
  //       const { status, body } = await supertest(app).get(`/carts/${res.body.data._id}`);
  //       // console.log('body', body)
  //       expect(status).toBe(200);
  //     });
  //   });
  // });

  // describe('testing cart update', () => {
  //   describe('fake cart update', () => {
  //     it('should return 202', async () => {
  //       const res = await supertest(app).post('/carts').send(cartPayload).set('Authorization', `Bearer ${Utils.access_token}`);
  //       const { status, body } = await supertest(app).put(`/carts/${res.body.data._id}`).send({
  //         status: 'IN_PROGRESS',
  //         description: 'Update description'
  //       });
  //       console.log('body', body);
  //       expect(status).toBe(202);
  //       expect(body).toEqual({
  //         data: {
  //           _id: expect.any(String),
  //           title: 'Conduct code reviews regularly',
  //           status: 'IN_PROGRESS',
  //           description: 'Update description',
  //           completed: false,
  //           createdAt: expect.any(String),
  //           updatedAt: expect.any(String)
  //         },
  //         status: 202,
  //         message: 'Success! cart updated'
  //       });
  //     });
  //   });
  //   describe('super admin product update', () => {
  //     it('should return 202', async () => {
  //       const res = await supertest(app).post('/carts').send(cartPayload).set('Authorization', `Bearer ${Utils.access_token}`);
  //       const { status, body } = await supertest(app)
  //         .put(`/carts/${res.body.data._id}`)
  //         .send({
  //           status: 'IN_PROGRESS',
  //           description: 'Update description'
  //         })
  //         .set('Authorization', `Bearer ${Utils.access_token}`);
  //       console.log('body', body);
  //       expect(status).toBe(202);
  //       expect(body).toEqual({
  //         status: 202,
  //         data: {
  //           _id: expect.any(String),
  //           title: 'Conduct code reviews regularly',
  //           completed: false,
  //           status: 'IN_PROGRESS',
  //           description: 'Update description',
  //           createdBy: expect.any(String),
  //           createdAt: expect.any(String),
  //           updatedAt: expect.any(String),
  //           __v: 0
  //         },
  //         message: 'Success! cart update by Admin'
  //       });
  //     });
  //   });
  // });

  // describe('testing cart destroy', () => {
  //   describe('fake cart destroy', () => {
  //     it('should return 202', async () => {
  //       const res = await supertest(app).post('/carts').send(cartPayload).set('Authorization', `Bearer ${Utils.access_token}`);
  //       const { status } = await supertest(app).delete(`/carts/${res.body.data._id}`);
  //       expect(status).toBe(202);
  //     });
  //   });
  //   describe('super admin cart destroy', () => {
  //     it('should return 202', async () => {
  //       const res = await supertest(app).post('/carts').send(cartPayload).set('Authorization', `Bearer ${Utils.access_token}`);
  //       const { status } = await supertest(app).delete(`/carts/${res.body.data._id}`).set('Authorization', `Bearer ${Utils.access_token}`);
  //       expect(status).toBe(202);
  //     });
  //   });
  // });
});
