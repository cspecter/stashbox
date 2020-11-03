import Cosmic from 'cosmicjs';
import {  Post, Posts, Preview , FeaturedPostNPosts} from '../interfaces';

const BUCKET_SLUG = process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG;
const READ_KEY = process.env.NEXT_PUBLIC_COSMIC_READ_KEY;
const WRITE_KEY = process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY;

export const bucket = Cosmic().bucket({
  slug: BUCKET_SLUG,
  read_key: READ_KEY,
  write_key: WRITE_KEY
})

const is404 = (error) => /not found/i.test(error.message)

export async function getPreviewPostBySlug(slug) {
  const params = {
    slug,
    props: 'slug',
    status: 'all',
  }

  try {
    const data = await bucket.getObject(params)
    return data.object
  } catch (error) {
    // Don't throw if an slug doesn't exist
    if (is404(error)) return
    throw error
  }
}

export async function getAllBrandsWithSlug():Promise<Post[]>{
  const params = {
    type: 'brands',
    props: 'slug',
  }
  const data = await bucket.getObjects(params)
  return data.objects
}

export async function getAllBrandsForHome(preview: Preview):Promise<Posts> {
  const params = {
    type: 'brands',
    props: 'slug,title,content,metadata' // Limit the API response data by props
    // props: 'title,slug,metadata,created_at',
    // ...(preview && { status: 'all' }),
  }
  const data = await bucket.getObjects(params)
  return data.objects
}




export async function getBrandAndMoreBrands(slug:string, preview:Preview){
  const singleObjectParams = {
    slug,
    props: 'slug,title,metadata',
    ...(preview && { status: 'all' }),
  }
  const moreObjectParams = {
    type: 'brands',
    limit: 3,
    props: 'title,slug,metadata,created_at',
    ...(preview && { status: 'all' }),
  }
  const object = await bucket.getObject(singleObjectParams).catch((error) => {
    // Don't throw if an slug doesn't exist
    if (is404(error)) return
    throw error
  })

  const featurePost = object?.object;
  const moreObjects = await bucket.getObjects(moreObjectParams)

  const morePosts = moreObjects.objects
    ?.filter(({ slug: object_slug }) => object_slug !== slug)
    .slice(0, 2)

  return {
    post: featurePost,
    morePosts,
  }
}