import { Injectable } from '@nestjs/common';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly s3: S3Client;
  constructor(){
    this.s3 = new S3Client({
      region: 'REGION',
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: process.env.YANDEX_CLOUD_STORAGE_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_STORAGE_KEY,
      },
    });
  }

  async saveFile(filePath: string, file: Express.Multer.File): Promise<string> {
    const bucketParams = {
      Bucket: 'photostock',
      Key: filePath,
      Body: file.buffer,
      ContentType: 'image/jpeg',
    };

    const command = new PutObjectCommand(bucketParams);
    try {
      await this.s3.send(command);
      return `https://photostock.storage.yandexcloud.net/${filePath}`;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async saveFiles(files: {filePath: string, file: Express.Multer.File}[]): Promise<string[]> {
    const paths = [] as string[]
    for(let i=0; i<files.length; i++) {
      const bucketParams = {
        Bucket: 'photostock',
        Key: files[i].filePath,
        Body: files[i].file.buffer,
        ContentType: 'image/jpeg',
      };

      const command = new PutObjectCommand(bucketParams);
      try {
        await this.s3.send(command);
        paths.push(`https://photostock.storage.yandexcloud.net/${files[i].filePath}`);
      } catch (e) {
        console.log(e);
        paths.push(null);
      }
    }
    return paths
  }

  async deleteAvatar(userId: number): Promise<string> {
    const listParams = {
      Bucket: 'photostock',
      Prefix: `content/user/${userId}/avatars/${userId}`,
    };

    const { Contents } = await this.s3.send(new ListObjectsV2Command(listParams));

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
      this.s3.send(command);
      return;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getFileWrapper(userId: number, file: Express.Multer.File) {
    return {
      filePath: `content/user/${userId}/posts/${v4()}.${file.mimetype.split('/')[1]}`,
      file: file,
    }
  }

  async deleteAll(): Promise<string> {
    const listParams = {
      Bucket: 'photostock',
      Prefix: `content`,
    };

    const { Contents } = await this.s3.send(new ListObjectsV2Command(listParams));

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
      this.s3.send(command);
      return;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
