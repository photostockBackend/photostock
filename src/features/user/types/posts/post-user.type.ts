import { PostFileCreateType, PostFileFoundType } from './post-file.types';

export type PostUserCreateType = {
  description: string;
  postFiles: PostFileCreateType[];
  userId: number;
};

export type PostUserFoundType = {
  id: number;
  postFiles: PostFileFoundType[];
} & PostUserCreateType;
