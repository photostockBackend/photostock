import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppandServerForTests } from './utils/app';
import * as path from 'path';
import { MailService } from '../src/adapters/mail/mail.service';

jest.setTimeout(60000);
describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    app = await createAppandServerForTests();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    app.close();
  });

  describe('tests', () => {
    let code;
    let accessToken;
    let refreshToken;
    let postId;
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

    it('should get profile', async () => {
      await request(server).get('/user/profile').expect(401);
      const res = await request(server)
        .get('/user/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.body).toStrictEqual({
        username: 'Nickolay',
        firstName: null,
        lastName: null,
        birthday: null,
        city: null,
        aboutMe: null,
        avatar: null,
      });
    });

    it('should update profile', async () => {
      await request(server).put('/user/profile').expect(401);
      const date = '01.01.2000';
      await request(server)
        .put('/user/profile')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('username', 'Nickolay')
        .field('firstName', 'newname')
        .field('lastName', 'surName')
        .field('birthday', date)
        .field('city', 'city')
        .field('aboutMe', 'aboutMe')
        .attach('avatar', path.join(__dirname, './1.jpeg'))
        .expect(204);
    });

    it('should get profile', async () => {
      const res = await request(server)
        .get('/user/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.body).toStrictEqual({
        aboutMe: 'aboutMe',
        city: 'city',
        birthday: expect.any(String),
        firstName: 'newname',
        avatar: expect.any(String),
        lastName: 'surName',
        username: 'Nickolay',
      });
    });

    it('should update profile', async () => {
      await request(server).put('/user/profile').expect(401);
      const date = '10.10.2010';
      await request(server)
        .put('/user/profile')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('username', 'Nickolay')
        .field('firstName', 'newnewname')
        .field('lastName', 'newnewsurName')
        .field('birthday', date)
        .field('city', 'newcity')
        .field('aboutMe', 'aboutMe')
        .attach('avatar', path.join(__dirname, './1.jpeg'))
        .expect(204);
    });

    it('should update profile without file', async () => {
      await request(server).put('/user/profile').expect(401);
      const date = '20.20.2020';
      await request(server)
        .put('/user/profile')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('username', 'Nickolay')
        .field('firstName', 'newname')
        .field('lastName', 'newsurName')
        .field('birthday', date)
        .field('city', 'city')
        .field('aboutMe', 'aboutMe')
        .expect(204);
    });

    it('should get updated-profile', async () => {
      const res = await request(server)
        .get('/user/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.body).toStrictEqual({
        aboutMe: 'aboutMe',
        city: 'city',
        birthday: expect.any(String),
        firstName: 'newname',
        avatar: expect.any(String),
        lastName: 'newsurName',
        username: 'Nickolay',
      });
    });

    it('should create post', async () => {
      await request(server).post('/user/post').expect(401);
      const res = await request(server).post('/user/post')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', 'description')
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .expect(201);
      //expect(res.body).toBe(0)
      postId = res.body.id
    });

    it('should update post', async () => {
      await request(server).put(`/user/post/${postId}`).expect(401);
      await request(server).put(`/user/post/${0}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
      await request(server).put(`/user/post/${postId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', 'newdescription')
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .expect(204);
    });

    it('should delete post', async () => {
      await request(server).delete(`/user/post/${postId}`).expect(401);
      await request(server).delete(`/user/post/${0}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
      await request(server).delete(`/user/post/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204);
    });
  });
});
