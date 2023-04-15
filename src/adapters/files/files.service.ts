import { Injectable } from '@nestjs/common';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'REGION',
  endpoint: 'https://storage.yandexcloud.net',
  credentials: {
    accessKeyId: process.env.YANDEX_CLOUD_STORAGE_ID,
    secretAccessKey: process.env.YANDEX_CLOUD_STORAGE_KEY,
  },
});

@Injectable()
export class FilesService {
  async saveFile(filePath: string, file: Express.Multer.File): Promise<string> {
    const bucketParams = {
      Bucket: 'photostock',
      Key: filePath,
      Body: file.buffer,
      ContentType: 'image/jpeg',
    };

    const command = new PutObjectCommand(bucketParams);
    try {
      await s3.send(command);
      return `https://photostock.storage.yandexcloud.net/${filePath}`;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAvatar(userId: number): Promise<string> {
    const listParams = {
      Bucket: 'photostock',
      Prefix: `content/user/${userId}/avatars/${userId}`,
    };

    const { Contents } = await s3.send(new ListObjectsV2Command(listParams));

    if (!Contents || Contents.length === 0) {
      return;
    }

    const deleteParams = {
      Bucket: 'photostock',
      Delete: { Objects: [] },
    };

    Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    const command = new DeleteObjectsCommand(deleteParams);
    try {
      s3.send(command);
      return;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<string> {
    const listParams = {
      Bucket: 'photostock',
      Prefix: `content`,
    };

    const { Contents } = await s3.send(new ListObjectsV2Command(listParams));

    if (!Contents || Contents.length === 0) {
      return;
    }

    const deleteParams = {
      Bucket: 'photostock',
      Delete: { Objects: [] },
    };

    Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    const command = new DeleteObjectsCommand(deleteParams);
    try {
      s3.send(command);
      return;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
