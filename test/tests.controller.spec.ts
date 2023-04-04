import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as cheerio from 'cheerio';
import * as constants from './utils/constants';
import { createAppandServerForTests } from './utils/app';
import { seedUsers } from './utils/seed-data';
import { generatePagination, generateQueryPagination, slicedEntityArray } from './utils/helpers';
import { MailBoxImap } from './utils/imap.service';
import { MailService } from '../src/adapters/mail/mail.service';

jest.setTimeout(60000)
describe('AppController', () => {
  let app: INestApplication
  let server: any
  beforeAll(async () => {
    app = await createAppandServerForTests()
    server = app.getHttpServer()

    const mailBox = new MailBoxImap();
    await mailBox.connectToMail();
    expect.setState({ mailBox });
  });

  afterAll(async () => {
    app.close()
  })

  describe('tests', () => {
    let code
    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })

    /*it('should seed data', async () => {
      await seedUsers(server)
    });*/

    it('should registered user', async () => {
      
      const mailService = app.get<MailService>(MailService)
      const sendEmail = jest.spyOn(mailService, 'sendEmail')
      
      await request(server).post('/auth/registration')
        .send({email: 'nickarbuzov@yandex.by', password: '111111'})
        .expect(204)
      
      expect(mailService.sendEmail).toBeCalled()
      code = sendEmail.mock.lastCall[2]
 
      await request(server).post('/auth/registration')
        .send({email: 'nickarbuzov@yandex.by', password: '111111'})
        .expect(400)

    });

    it('should try login user with confirm-profile and without confirm-profile', async () => {
      
      await request(server).post('/auth/login')
        .send({email: 'nickarbuzov@yandex.by', password: '111111'})
        .expect(401)
      
      await request(server).post('/auth/registration-confirmation')
        .send({code: 'incorrect code'})
        .expect(400)
      
      await request(server).post('/auth/login')
        .send({email: 'nickarbuzov@yandex.by', password: '111111'})
        .expect(401)

      await request(server).post('/auth/registration-confirmation')
        .send({code: code})
        .expect(204)
 
      await request(server).post('/auth/login')
        .send({email: 'nickarbuzov@yandex.by', password: '111111'})
        .expect(200)

    });

    /*it('should try login user with incorrect credentials', async () => {
      
      await request(server).post('/auth/login')
        .send({email: 'incorrect mail', password: '111111'})
        .expect(401)
      
      await request(server).post('/auth/login')
        .send({email: 'nickarbuzov@yandex.by', password: 'incorrect pass'})
        .expect(401)

    });*/

  });
});
