import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  async saveAvatar(userId: number, file: Express.Multer.File): Promise<string> {
    const s3 = new S3Client({
      region: 'REGION',
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: process.env.YANDEX_CLOUD_STORAGE_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_STORAGE_KEY,
      },
    });

    const bucketParams = {
      Bucket: 'photostock',
      Key: `content/user/${userId}/avatars/${userId}.${
        file.mimetype.split('/')[1]
      }`,
      body: file.buffer,
    };

    const command = new PutObjectCommand(bucketParams);
    try {
      await s3.send(command);
      return `https://storage.yandexcloud.net/photostock/content/user/${userId}/avatars/${userId}.${
        file.mimetype.split('/')[1]
      }`;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
