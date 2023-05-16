import {
  PostFileCreateType,
  PostFileFoundType,
} from '../../features/user/types/posts/post-file.types';

export class PostFileDomain {
  id: number;
  postId: number;
  origResolution: string;
  minResolution: string;
  mimeType: 'image' | 'video';

  static async makeInstanceWithoutId(postFileDto: PostFileCreateType) {
    const postFile = new PostFileDomain();
    postFile.origResolution = postFileDto.origResolution;
    postFile.minResolution = postFileDto.minResolution;
    postFile.mimeType = postFileDto.mimeType;
    return postFile;
  }
  static async makeInstanceWithId(postFileDto: PostFileFoundType) {
    const postFile = new PostFileDomain();
    postFile.id = postFileDto.id;
    postFile.postId = postFileDto.postId;
    postFile.origResolution = postFileDto.origResolution;
    postFile.minResolution = postFileDto.minResolution;
    postFile.mimeType = postFileDto.mimeType;
    return postFile;
  }
}
