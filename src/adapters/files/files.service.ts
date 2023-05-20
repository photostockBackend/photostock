import { Injectable } from '@nestjs/common';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import sharp from 'sharp';
import { PostFileCreateType } from '../../features/user/types/posts/post-file.types';

@Injectable()
export class FilesService {
  private readonly s3: S3Client;
  constructor() {
    this.s3 = new S3Client({
      region: 'REGION',
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: process.env.YANDEX_CLOUD_STORAGE_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_STORAGE_KEY,
      },
    });
  }

  async saveFile(
    userId: number,
    buffer: Buffer,
    folder: 'avatars' | 'posts',
  ): Promise<string> {
    const filePath = this.createFilePath(userId, folder);
    const bucketParams = {
      Bucket: 'photostock',
      Key: filePath,
      Body: buffer,
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

  async saveFiles(
    userId: number,
    files: Express.Multer.File[],
  ): Promise<PostFileCreateType[]> {
    const paths: PostFileCreateType[] = [];
    for (let i = 0; i < files.length; i++) {
      const compressedImage = await sharp(files[i].path)
        .resize({ width: 300, height: 300, fit: 'inside' })
        .toBuffer();
      paths.push({
        origResolution: await this.saveFile(userId, files[i].buffer, 'posts'),
        minResolution: await this.saveFile(userId, compressedImage, 'posts'),
        mimeType: 'image',
      });
    }
    return paths;
  }
  createFilePath(userId: number, folder: string) {
    return `content/user/${userId}/${folder}/${v4()}.jpeg`;
  }
  async deleteFiles(links: string[]): Promise<string> {
    const deleteParams = {
      Bucket: 'photostock',
      Delete: { Objects: [] },
    };
    links.forEach((l) => {
      deleteParams.Delete.Objects.push({ Key: l.slice(l.indexOf('/', 8)) });
    });

    this.s3.send(new DeleteObjectsCommand(deleteParams));
    try {
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

    const { Contents } = await this.s3.send(
      new ListObjectsV2Command(listParams),
    );

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
