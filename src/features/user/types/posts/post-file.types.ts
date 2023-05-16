export type PostFileCreateType = {
  postId: number;
  origResolution: string;
  minResolution: string;
  mimeType: 'image' | 'video';
};

export type PostFileFoundType = PostFileCreateType & {
  id: number;
};
