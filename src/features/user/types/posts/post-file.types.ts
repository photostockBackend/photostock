export type PostFileCreateType = {
  origResolution: string;
  minResolution: string;
  mimeType: string;
};

export type PostFileFoundType = PostFileCreateType & {
  id: number;
  postId: number;
};
