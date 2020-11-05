import { bucket } from './api'
import { v4 as uuidv4 } from 'uuid';
import {blobCreationFromURI} from './imageMethods'
import {addMedia, uploadVideoToCosmic} from './cosmicMethods'

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
            console.log(image);
            postParams.image = image.media.name;
            const post = await addPost(postParams);
            return post
        } else if (params.video) {
            const video = await uploadVideoToCosmic(params.video);
            postParams.video = video._id;
            const post = await addPost(postParams);
            return post
        } else {

        }
    } catch (error) {
        throw new Error(error)
    }
}