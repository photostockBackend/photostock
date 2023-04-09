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

    //const mailBox = new MailBoxImap();
    //await mailBox.connectToMail();
    //expect.setState({ mailBox });
  });

  afterAll(async () => {
    app.close()
  })

  describe('tests', () => {
    const password = '111111'
    const newPassword = '222222'
    let code
    let newCode
    let accessToken
    let refreshToken
    let newAccessToken
    let newRefreshToken
    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })

    /*it('should seed data', async () => {
      await seedUsers(server)
    });*/

    /*it('should registered user, and should registered new user, while prev user not confirmed', async () => {
      
      const mailService = app.get<MailService>(MailService)
      const sendEmail = jest.spyOn(mailService, 'sendEmail')
      
      await request(server).post('/auth/registration')
        .send({userName: 'Nickolay', email: 'nickarbuzov@yandex.by', password: password})
        .expect(204)
      
      await request(server).post('/auth/registration')
        .send({userName: 'Nickolay', email: 'nickarbuzov@yandex.by', password: password})
        .expect(204)

      expect(mailService.sendEmail).toBeCalled()
      code = sendEmail.mock.lastCall[2]

    });

    it('should try send new code for not valid mail and for valid mail', async () => {
      
      const mailService = app.get<MailService>(MailService)
      const sendEmail = jest.spyOn(mailService, 'sendEmail')

      await request(server).post('/auth/registration-email-resending')
        .send({email: 'incorrect@mail.by'})
        .expect(400)

      await request(server).post('/auth/registration-email-resending')
        .send({email: 'nickarbuzov@yandex.by'})
        .expect(204)
      
      expect(mailService.sendEmail).toBeCalled()
      newCode = sendEmail.mock.lastCall[2]

    });

    it('should try login user with confirm-profile and without confirm-profile', async () => {
      
      await request(server).post('/auth/login')
        .send({emailOrUsername: 'nickarbuzov@yandex.by', password: password})
        .expect(401)
      
      await request(server).post('/auth/registration-confirmation')
        .send({code: 'incorrect code'})
        .expect(400)
      
      await request(server).post('/auth/login')
        .send({emailOrUsername: 'nickarbuzov@yandex.by', password: password})
        .expect(401)

      await request(server).post('/auth/registration-confirmation')
        .send({code: code})
        .expect(400)

      await request(server).post('/auth/registration-confirmation')
        .send({code: newCode})
        .expect(204)
 
      const res = await request(server).post('/auth/login')
        .send({emailOrUsername: 'nickarbuzov@yandex.by', password: password})
        .expect(200)
      accessToken = res.body.accessToken
      refreshToken = res.header['set-cookie']
    });

    it('should try login user with incorrect credentials', async () => {
      
      await request(server).post('/auth/login')
        .send({email: 'incorrect mail', password: password})
        .expect(401)
      
      await request(server).post('/auth/login')
        .send({email: 'nickarbuzov@yandex.by', password: 'incorrect pass'})
        .expect(401)

    });

    it('should set new password by incorrect email, correct email and try to login', async () => {
      
      const mailService = app.get<MailService>(MailService)
      const sendEmail = jest.spyOn(mailService, 'sendEmail')

      await request(server).post('/auth/password-recovery')
        .send({email: 'incorrect@mail.by'})
        .expect(400)

      await request(server).post('/auth/password-recovery')
        .send({email: 'nickarbuzov@yandex.by'})

      expect(mailService.sendEmail).toBeCalled()
      newCode = sendEmail.mock.lastCall[2]
      
      await request(server).post('/auth/new-password')
        .send({newPassword: newPassword, recoveryCode: code})
        .expect(400)

      await request(server).post('/auth/new-password')
        .send({newPassword: newPassword, recoveryCode: newCode})
        .expect(204)

    });

    it('should try to login with old password and new password', async () => {

      await request(server).post('/auth/login')
        .send({email: 'nickarbuzov@yandex.by', password: password})
        .expect(401)
      
      const res = await request(server).post('/auth/login')
        .send({email: 'nickarbuzov@yandex.by', password: newPassword})
        .expect(200)

      accessToken = res.body.accessToken
      refreshToken = res.header['set-cookie']

    });

    it('should try to get me information, with access-token and without access-token or not valid access-token', async () => {

      await request(server).get('/auth/me').expect(401)
      
      await request(server).get('/auth/me')
        .set('Cookie', refreshToken)
        .expect(200)

    });

    it('should try to refresh-tokens, by valid token and not valid token', async () => {

      await request(server).post('/auth/refresh-token').expect(401)

      const res = await request(server).post('/auth/refresh-token')
        .set('Cookie', refreshToken)
        .expect(200)

      await request(server).post('/auth/refresh-token')
        .set('Cookie', refreshToken)
        .expect(401)

      newAccessToken = res.body.accessToken
      newRefreshToken = res.header['set-cookie']

    });

    it('should try to logout, by valid token and not valid token', async () => {

      await request(server).post('/auth/logout').expect(401)

      await request(server).post('/auth/logout')
        .set('Cookie', refreshToken)
        .expect(401)

      await request(server).post('/auth/logout')
        .set('Cookie', newRefreshToken)
        .expect(204)

      await request(server).post('/auth/logout')
        .set('Cookie', newRefreshToken)
        .expect(401)

      await request(server).post('/auth/refresh-token')
        .set('Cookie', newRefreshToken)
        .expect(401)

    });

    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })*/
    
  });
});
