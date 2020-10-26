import Cosmic from 'cosmicjs';
import {  Post, Posts, Preview , FeaturedPostNPosts} from '../interfaces';

const BUCKET_SLUG = process.env.COSMIC_BUCKET_SLUG
const READ_KEY = process.env.COSMIC_READ_KEY

console.log(process.env, BUCKET_SLUG, READ_KEY);

const bucket = Cosmic().bucket({
  slug: BUCKET_SLUG,
  read_key: READ_KEY,
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

export async function addUserToCosmic(uid:string, email:string, username:string) {
  const params = {
    title: uid,
    type_slug: 'users',
    content: '',
    metafields: [
      {
        key: 'username',
        type: 'text',
        value: username
      },
      {
        key: 'email',
        type: 'text',
        value: email
      }
    ],
    options: {
      slug_field: uid
    }
  };

  try {
    const data = bucket.addObject(params);
    return data
  } catch (error) {
    throw new Error(error);
  }

}

export async function getUser(uid) {
  try {
    const user = await bucket.getObject({
      slug: uid,
      props: 'slug,title,username,zip_code,email, birthday, is_over_21' // get only what you need
    });

    return user
  } catch (error) {
    throw new Error(error)
  }
}

export async function updateUser({uid, birthday, isOver21}) {
  try {
    const params = {
      slug: uid
    };

    if (birthday) params["birthday"] = birthday;
    if (isOver21) params["is_over_21"] = isOver21;

    const user = await bucket.editObjectMetafields(params);

    return user

  } catch (error) {
    throw new Error(error);
  }
}