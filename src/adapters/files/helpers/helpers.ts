import * as fs from 'fs';
import { dirname } from 'node:path';
import path from 'path';

export const fileReader = (relativePath: string) => {
  return new Promise((resolve, reject) => {
    const rootDir = dirname(require.main.filename);
    const filePath = path.join(rootDir, relativePath);
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
};

export const saveFileReader = (relativePath: string, data: Buffer) => {
  return new Promise<void>((resolve, reject) => {
    const rootDir = dirname(require.main.filename);
    const filePath = path.join(rootDir, relativePath);
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve();
    });
  });
};

export const ensureDirAsync = (relativePath) => {
  return new Promise<void>((resolve, reject) => {
    const rootDir = dirname(require.main.filename);
    const filePath = path.join(rootDir, relativePath);
    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
