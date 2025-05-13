export const postsQuery = `*[_type == "post" && !(_id in path('drafts.**'))] | order(publishedAt desc){
  _id,
  title,
  slug,
  mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  publishedAt,
  body,
  excerpt,
  "author": author->{name, image},
  "categories": categories[]->title
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  publishedAt,
  body,
  excerpt,
  "author": author->{name, image},
  "ogImage": mainImage.asset->url
}`; 