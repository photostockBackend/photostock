export type ProfilePhotoCreateType = {
  profileId: number;
  origResolution: string;
  minResolution: string;
};

export type ProfilePhotoFoundType = ProfilePhotoCreateType & {
  id: number;
};
