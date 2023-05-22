import { PostFileDomain } from '../../../../core/domain/post-file.domain';

export const POSTS_FILES_REPO = 'POSTS FILES REPO';
export interface IPostsFilesRepo {
  createPostFile(file: PostFileDomain): Promise<PostFileDomain>;
  deleteManyById(deletedFiles: number[]): Promise<boolean>;
}
