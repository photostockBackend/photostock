import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as cheerio from 'cheerio';
import * as constants from './utils/constants';
import { createAppandServerForTests } from './utils/app';
import { seedUsers } from './utils/seed-data';
import { generatePagination, generateQueryPagination, slicedEntityArray } from './utils/helpers';
import { MailBoxImap } from './utils/imap.service';

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
    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204)
    })

    it('should seed data', async () => {
      await seedUsers(server)
    });

    it('test cookie guard', async () => {
      const cookie = await request(server).post('/auth/refresh-token')
        .set('Cookie', constants.variables.cookies[0])
      //expect(cookie.body).toBe(0)
      const cookie2 = await request(server).post('/auth/refresh-token')
      expect(cookie2.body).toBe(0)
    });

    it('test extract token', async () => {
      await request(server).post('/auth/test')
        .set('Authorization', `Bearer ${constants.variables.accessTokens[0]}`)
    });

    /*
    it('should read email and get validConfirmationCode', async () => {
      const mailBox: MailBoxImap = expect.getState().mailBox;
      const email = await mailBox.waitNewMessage(2);
      const html = await mailBox.getMessageHtml(email);
      expect(html).not.toBeNull();
      const link = cheerio.load(html).root().find('a').attr('href');
      const validConfirmationCode = link.split('?')[1].split('=')[1];
      expect(validConfirmationCode).not.toBeNull();
      expect(validConfirmationCode).not.toBeUndefined();
      const isUuid = validConfirmationCode;
      expect(isUuid).toBeTruthy();
      // if (isUuid) await mailBox.deleteAllTodayMessages();
      expect.setState({ validConfirmationCode });
    });
    */

  });
});
