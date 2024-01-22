import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../server';
import Utils from './utils';

const app = createServer();

const todoPayload = {
  title: 'Conduct code reviews regularly',
  status: 'TODO',
  description: 'Some description'
};

describe('todo', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('testing todo list', () => {
    it('get all todo', async () => {
      const { status } = await supertest(app).get('/todos');
      expect(status).toBe(200);
    });
  });

  describe('testing todo create', () => {
    describe('invalid todo payload', () => {
      it('should return 422', async () => {
        const { status } = await supertest(app).post('/todos');
        expect(status).toBe(422);
      });
    });
    describe('fake todo creation', () => {
      it('should return 201', async () => {
        const { status, body } = await supertest(app).post('/todos').send(todoPayload);
        expect(status).toBe(201);
        // console.log('body', body);
        expect(body).toEqual({
          status: 201,
          message: 'Success! Todo created',
          data: {
            _id: expect.any(String),
            completed: false,
            createdBy: expect.any(String),
            description: 'Some description',
            status: 'TODO',
            title: 'Conduct code reviews regularly'
          }
        });
      });
    });
    describe('super admin todo creation', () => {
      it('should return 201', async () => {
        const { status, body } = await supertest(app).post('/todos').send(todoPayload).set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(201);
        expect(body).toEqual({
          status: 201,
          message: 'Success! Todo created by admin',
          data: {
            __v: expect.any(Number),
            _id: expect.any(String),
            completed: false,
            createdBy: expect.any(String),
            description: 'Some description',
            status: 'TODO',
            title: 'Conduct code reviews regularly',
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          }
        });
      });
    });
  });

  // describe('testing single todo', () => {
  //   describe('test get todo', () => {
  //     it('should return 404', async () => {
  //       const { status } = await supertest(app).get(`/todos/todoID`);
  //       expect(status).toBe(404);
  //     });
  //     it('should return 200', async () => {
  //       const res = await supertest(app)
  //         .post('/todos')
  //         .send(todoPayload)
  //         .set('Authorization', `Bearer ${Utils.access_token}`);
  //       const { status, body } = await supertest(app).get(`/todos/${res.body.data._id}`);
  //       // console.log('body', body)
  //       expect(status).toBe(200);
  //     });
  //   });
  // });

  describe('testing todo update', () => {
    describe('fake todo update', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/todos').send(todoPayload).set('Authorization', `Bearer ${Utils.access_token}`);
        const { status, body } = await supertest(app).put(`/todos/${res.body.data._id}`).send({
          status: 'IN_PROGRESS',
          description: 'Update description'
        });
        console.log('body', body);
        expect(status).toBe(202);
        expect(body).toEqual({
          data: {
            _id: expect.any(String),
            title: 'Conduct code reviews regularly',
            status: 'IN_PROGRESS',
            description: 'Update description',
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          },
          status: 202,
          message: 'Success! todo updated'
        });
      });
    });
    describe('super admin product update', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/todos').send(todoPayload).set('Authorization', `Bearer ${Utils.access_token}`);
        const { status, body } = await supertest(app)
          .put(`/todos/${res.body.data._id}`)
          .send({
            status: 'IN_PROGRESS',
            description: 'Update description'
          })
          .set('Authorization', `Bearer ${Utils.access_token}`);
        console.log('body', body);
        expect(status).toBe(202);
        expect(body).toEqual({
          status: 202,
          data: {
            _id: expect.any(String),
            title: 'Conduct code reviews regularly',
            completed: false,
            status: 'IN_PROGRESS',
            description: 'Update description',
            createdBy: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: 0
          },
          message: 'Success! Todo update by Admin'
        });
      });
    });
  });

  describe('testing todo destroy', () => {
    describe('fake todo destroy', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/todos').send(todoPayload).set('Authorization', `Bearer ${Utils.access_token}`);
        const { status } = await supertest(app).delete(`/todos/${res.body.data._id}`);
        expect(status).toBe(202);
      });
    });
    describe('super admin todo destroy', () => {
      it('should return 202', async () => {
        const res = await supertest(app).post('/todos').send(todoPayload).set('Authorization', `Bearer ${Utils.access_token}`);
        const { status } = await supertest(app).delete(`/todos/${res.body.data._id}`).set('Authorization', `Bearer ${Utils.access_token}`);
        expect(status).toBe(202);
      });
    });
  });
});
