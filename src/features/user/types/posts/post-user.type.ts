import { PostFileFoundType } from './post-file.types';

export type PostUserCreateType = {
  description: string;
  userId: number;
};

export type PostUserFoundType = {
  id: number;
  description: string;
  postFiles: PostFileFoundType[];
  userId: number;
};
