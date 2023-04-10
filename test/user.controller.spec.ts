import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppandServerForTests } from './utils/app';
import { seedUsers } from './utils/seed-data';
import { generatePagination, generateQueryPagination, slicedEntityArray } from './utils/helpers';
import * as path from 'path';
import { MailService } from '../src/adapters/mail/mail.service';

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
    let code
    let newCode
    let accessToken
    let refreshToken
    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })

    it('should registered user, confirmed email and login for get tokens', async () => {
      
      const mailService = app.get<MailService>(MailService)
      const sendEmail = jest.spyOn(mailService, 'sendEmail')
      
      await request(server).post('/auth/registration')
        .send({username: 'Nickolay', email: 'nickarbuzov@yandex.by', password: '111111'})
        .expect(204)

      expect(mailService.sendEmail).toBeCalled()
      code = sendEmail.mock.lastCall[2]

      await request(server).post('/auth/registration-confirmation')
        .send({code: code})
        .expect(204)
      
      const res = await request(server).post('/auth/login')
        .send({emailOrUsername: 'nickarbuzov@yandex.by', password: '111111'})
        .expect(200)

      accessToken = res.body.accessToken
      refreshToken = res.header['set-cookie']

    });

    it('should send file', async () => {
      const date = new Date().toISOString()
      const res = await request(server).post('/user/profile')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('username', 'Nickolay')
        .field('name', 'name')
        .field('surName', 'surName')
        .field('birthday', date)
        .field('city', 'city')
        .attach('file', path.join(__dirname, './1.jpeg'))
      expect(res).toBe(0)
      })

    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })
    
  });
});

