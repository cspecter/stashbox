import { bucket } from './api'
import { v4 as uuidv4 } from 'uuid';
import {blobCreationFromURI} from './imageMethods'

const API_URL = process.env.COSMIC_API_URL || 'https://api.cosmicjs.com'
const UPLOAD_API_URL = process.env.UPLOAD_API_URL || 'https://upload.cosmicjs.com'
const API_VERSION = process.env.COSMIC_API_VERSION || 'v1'
const URI = `${API_URL}/${API_VERSION}`
const WRITE_KEY = process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY;
const BUCKET_SLUG = process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG;
const { requestHandler } = require('./requestHandler')

const HTTP_METHODS = {
    POST: 'post',
    GET: 'get',
    FETCH: 'fetch',
    PUT: 'put',
    PATCH: 'patch',
    DELETE: 'delete'
  }

function addMedia(params) {
    const endpoint = `${UPLOAD_API_URL}/${API_VERSION}/${BUCKET_SLUG}/media`
    const data = new FormData()

    if (params.media.buffer) {
        console.log("appending media");
      data.append('media', params.media.buffer, params.media.originalname)
    } else {
      data.append('media', params.media, params.media.name)
    }
    if (WRITE_KEY) {
      data.append('write_key', WRITE_KEY)
    }
    if (params.folder) {
      data.append('folder', params.folder)
    }
    if (params.metadata) {
      data.append('metadata', JSON.stringify(params.metadata))
    }
    
    for (var key of data.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }

    const getHeaders = ((form) => new Promise((resolve, reject) => {
        console.log(data.entries());
      if (params.media.buffer) {
        form.getLength((err, length) => {
          if (err) reject(err)
          const headers = { 'Content-Length': length, ...form.getHeaders() }
          resolve(headers)
        })
      } else {
        resolve({ 'Content-Type': 'multipart/form-data' })
      }
    })
    )
    return requestHandler(HTTP_METHODS.POST, endpoint, data, { 'Content-Type': 'multipart/form-data' })
}

export async function addMediaFromURI(uri, originalname) {
    const buffer = blobCreationFromURI(uri);
    
    const media_object = {
        originalname,
        buffer
    }

    try {
        const data = await addMedia({
            media: media_object
        })
        console.log("Made post", data)
        return data
    } catch (error) {
        throw new Error(error);
    }

}

export async function addPost(params) {
    const uid = uuidv4();
    const postParams = {
        title: uid,
        type_slug: 'posts',
        content: params.message,
        metafields: [
            {
                title: "User",
                key: "user",
                type: "object",
                object_type: "users",
                value: params.user
            },
            {
                title: "Products",
                key: "products",
                type: "objects",
                object_type: "products",
                value: params.products.join(",")
            },
        ],
        options: {
            slug_field: uid
        }
    }

    if (params.brand) {
        postParams.metafields.push(
            {
                title: "Brand",
                key: "brand",
                type: "objects",
                object_type: "brands",
                value: params.brand
            }
        )
    }

    if (params.image) {
        postParams.metafields.push(
            {
                title: "Image",
                key: "image",
                type: "file",
                value: params.image
            }
        )
    }

    if (params.video) {
        postParams.metafields.push(
            {
                title: "Video",
                key: "video",
                type: "objects",
                object_type: "mux-videos",
                value: params.video
            }
        )
    }

    if (params.external_image) {
        postParams.metafields.push(
            {
                title: "External Image",
                key: "external_image",
                type: "text",
                value: params.external_image
            }
        )
    }

    if (params.external_video) {
        postParams.metafields.push(
            {
                title: "External Video",
                key: "external_video",
                type: "text",
                value: params.external_video
            }
        )
    }

    if (params.post_date) {
        postParams.metafields.push(
            {
                title: "Post Date",
                key: "post_date",
                type: "number",
                value: params.post_date
            }
        )
    }

    try {
        const data = await bucket.addObject(postParams)
        return data
    } catch (error) {
        throw new Error(error)
    }

}

export async function createPost(params) {
    const postParams = Object.assign({}, params)
    try {
        if (params.image) {
            const image = await addMediaFromURI(params.image, uuidv4());
            postParams.image = image.media.original_name;
            const post = await addPost(postParams);
            return post
        } else if (params.video) {

        } else {

        }
    } catch (error) {
        throw new Error(error)
    }
}