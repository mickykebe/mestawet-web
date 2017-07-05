import { schema, normalize } from 'normalizr';

export const SCHEMA_NAME_YOUTUBEVIDEOS = 'youtubeVideos';
export const SCHEMA_NAME_ARTICLES = 'articles';
export const SCHEMA_NAME_SOURCES = 'sources';

export const sourcesSchema = new schema.Entity(SCHEMA_NAME_SOURCES, undefined, {
  idAttribute: '_id'
});

export const youtubeVideoSchema = new schema.Entity(SCHEMA_NAME_YOUTUBEVIDEOS, undefined, {
  idAttribute: '_id'
});

export const articleSchema = new schema.Entity(SCHEMA_NAME_ARTICLES, undefined, {
  idAttribute: '_id'
});

export const postsSchema = new schema.Array({
  youtubeVideos: youtubeVideoSchema,
  articles: articleSchema,
}, (input, parent, key) => `${input.kind}s`);

export const schemas = {
  [SCHEMA_NAME_ARTICLES]: articleSchema,
  [SCHEMA_NAME_YOUTUBEVIDEOS]: youtubeVideoSchema,
  [SCHEMA_NAME_SOURCES]: sourcesSchema,
}

export const homeNormalizer = (data) => 
  Object.assign({}, data, { posts: normalize(data.posts, postsSchema) });

export const sourcesNormalizer = (data) => 
  normalize(data, new schema.Array(sourcesSchema));

export const articleNormalizer = (data) => normalize(data, schemas[`${data.kind}s`]);

export const videoNormalizer = (data) => normalize(data, schemas[`${data.kind}s`]);

export default schemas;