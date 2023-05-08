import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppAndServerForTests } from './utils/app';
import * as path from 'path';
import { MailService } from '../src/adapters/mail/mail.service';

jest.setTimeout(60000);
describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    app = await createAppAndServerForTests();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('tests', () => {
    let code;
    let accessToken;
    let refreshToken;
    let customerId;
    const customerEmail = 'mail@mail.com'
    const cardNumber = '4242424242424242'
    const expMonth = '12'
    const expYear = '34'
    const cvc = '111'
    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204);
    });

    it('should registered user-profile, confirmed email and login for get tokens', async () => {
      const mailService = app.get<MailService>(MailService);
      const sendEmail = jest.spyOn(mailService, 'sendEmail');

      await request(server)
        .post('/auth/registration')
        .send({
          username: 'Nickolay',
          email: 'nickarbuzov@yandex.by',
          password: '111111',
        })
        .expect(204);

      expect(mailService.sendEmail).toBeCalled();
      code = sendEmail.mock.lastCall[2];

      await request(server)
        .post('/auth/registration-confirmation')
        .send({ code: code })
        .expect(204);

      const res = await request(server)
        .post('/auth/login')
        .send({ emailOrUsername: 'nickarbuzov@yandex.by', password: '111111' })
        .expect(200);

      accessToken = res.body.accessToken;
      refreshToken = res.header['set-cookie'];
    });

    it('should create customer', async () => {
      const res = await request(server).post('/payments/strapi/createcustomer')
        .send({email: customerEmail})
      customerId = res.body.customerId
    });

    it('should create and attach card to existing customer', async () => {
      const res = await request(server).post('/payments/strapi/attachcard')
        .send({customerId, cardNumber, expMonth, expYear, cvc})
    });

    it('should create subscription', async () => {
      const res = await request(server).post('/payments/strapi/createsubcription')
        .send({customerId})
    });

    it('should test paypal', async () => {
      const res = await request(server).post('/payments/paypal/createcustomer')
    });

    /*it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204);
    });*/
  });
});
