import { client } from './client';
import { postsQuery, postBySlugQuery } from './queries';

export async function getPosts() {
  return client.fetch(postsQuery);
}

export async function getPostBySlug(slug: string) {
  return client.fetch(postBySlugQuery, { slug });
} 