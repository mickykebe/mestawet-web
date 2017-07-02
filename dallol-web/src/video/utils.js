export const getVideoFromStoreVideos = (id, videos) => {
  return videos && (
    ( videos.youtubeVideos && videos.youtubeVideos[id])
  );
};