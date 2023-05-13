import { INestApplication } from '@nestjs/common';
import request from 'supertest';
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
    let postId;
    let existedPhotos;
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
        avatar: {
          original: null,
          thumbnail: null,
        }, 
      });
    });

    it('should update profile', async () => {
      await request(server).put('/user/profile/info').expect(401);
      const date = '01.01.2000';
      await request(server)
        .put('/user/profile/info')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'Nickolay',
          firstName: 'newname',
          lastName: 'surName',
          birthday: date,
          city: 'city',
          aboutMe: 'aboutMe',
        })
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
        avatar: {
          original: null,
          thumbnail: null,
        }, 
        lastName: 'surName',
        username: 'Nickolay',
      });
    });

    it('should update profile photo', async () => {
      await request(server).put('/user/profile/photo').expect(401);
      await request(server)
        .put('/user/profile/photo')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
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
        avatar: {
          original: expect.any(String),
          thumbnail: expect.any(String),
        }, 
        lastName: 'surName',
        username: 'Nickolay',
      });
    });

    it('should update profile', async () => {
      await request(server).put('/user/profile/info').expect(401);
      const date = '10.10.2010';
      await request(server)
        .put('/user/profile/info')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'Nickolay',
          firstName: 'newnewname',
          lastName: 'newnewsurName',
          birthday: date,
          city: 'newcity',
          aboutMe: 'aboutMe',
        })
        .expect(204);
    });

    it('should get updated-profile', async () => {
      const res = await request(server)
        .get('/user/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.body).toStrictEqual({
        aboutMe: 'aboutMe',
        city: 'newcity',
        birthday: expect.any(String),
        firstName: 'newnewname',
        avatar: {
          original: expect.any(String),
          thumbnail: expect.any(String),
        }, 
        lastName: 'newnewsurName',
        username: 'Nickolay',
      });
    });

    it('should create post', async () => {
      await request(server).post('/user/post').expect(401);
      const res = await request(server)
        .post('/user/post')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', 'description')
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .expect(201);
      postId = res.body.id;
    });

    it('should get specific post to check count of photos', async () => {
      const res = await request(server).get(`/user/post/${postId}`);
      expect(res.body.postPhotos.length).toBe(5);
      existedPhotos = res.body.postPhotos;
    });

    it('should update post', async () => {
      await request(server).put(`/user/post/${postId}`).expect(401);
      await request(server)
        .put(`/user/post/${0}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
      await request(server)
        .put(`/user/post/${postId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', 'newdescription')
        .field('existedPhotos', existedPhotos)
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .expect(204);

      const res = await request(server).get(`/user/post/${postId}`);
      expect(res.body.postPhotos.length).toBe(10);
      existedPhotos = res.body.postPhotos;
    });

    it('should return error if try to update post with over 10 photos', async () => {
      await request(server)
        .put(`/user/post/${postId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', 'newdescription')
        .field('existedPhotos', existedPhotos)
        .attach('postPhoto', path.join(__dirname, './1.jpeg'))
        .expect(400);
    });

    it('should get specific post to check count of photos', async () => {
      const res = await request(server).get(`/user/post/${postId}`);
      expect(res.body.postPhotos.length).toBe(10);
    });

    it('should update post to reduce of photos', async () => {
      await request(server)
        .put(`/user/post/${postId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('description', 'newdescription')
        .field('existedPhotos', existedPhotos.slice(5))
        .expect(204);

      const res = await request(server).get(`/user/post/${postId}`);
      expect(res.body.postPhotos.length).toBe(5);
    });

    it('should delete post', async () => {
      await request(server).delete(`/user/post/${postId}`).expect(401);
      await request(server)
        .delete(`/user/post/${0}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
      await request(server)
        .delete(`/user/post/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
      await request(server).get(`/user/post/${postId}`).expect(404);
    });

    /*it('should delete all data', async () => {
      await request(server).delete('/delete-all-data').expect(204);
    });*/
  });
});
