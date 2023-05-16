export type PostFileCreateType = {
  origResolution: string;
  minResolution: string;
  mimeType: 'image' | 'video';
};

export type PostFileFoundType = PostFileCreateType & {
  id: number;
  postId: number;
};
