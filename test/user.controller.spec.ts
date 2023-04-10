import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppandServerForTests } from './utils/app';
import { seedUsers } from './utils/seed-data';
import { generatePagination, generateQueryPagination, slicedEntityArray } from './utils/helpers';
import * as fs from 'fs'
import { fileReader } from '../src/adapters/files/helpers/helpers';
import * as path from 'path';
import { dirname } from 'node:path';

jest.setTimeout(60000)
describe('AppController', () => {
  let app: INestApplication
  let server: any
  beforeAll(async () => {
    app = await createAppandServerForTests()
    server = app.getHttpServer()
  });

  afterAll(async () => {
    app.close()
  })

  describe('tests', () => {
    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })

    /*it('should seed data', async () => {
      await seedUsers(server)
    });*/
    it('should send file', async () => {
      const response = await request(server).post('/user/profile')
        .set('Content-Type', 'multipart/form-data')
        .field('name', 'John Doe')
        .field('email', 'johndoe@example.com')
        .attach('file', path.join(__dirname, './1.jpeg'))

      expect(response).toBe(0)
      })

    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })
    
  });
});
