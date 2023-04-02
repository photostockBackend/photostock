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

  });
});
