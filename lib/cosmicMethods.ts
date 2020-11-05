import axios from 'axios';
import {bucket} from './api';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_API_URL = process.env.UPLOAD_API_URL || 'https://upload.cosmicjs.com'
const API_VERSION = process.env.COSMIC_API_VERSION || 'v1'
const WRITE_KEY = process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY;
const BUCKET_SLUG = process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG;
const MUX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MUX_ACCESS_TOKEN;
const MUX_SECRET = process.env.NEXT_PUBLIC_MUX_SECRET;

const { requestHandler } = require('./requestHandler')

const HTTP_METHODS = {
    POST: 'post',
    GET: 'get',
    FETCH: 'fetch',
    PUT: 'put',
    PATCH: 'patch',
    DELETE: 'delete'
  }

export function addMedia(params) {
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

export async function uploadVideoToCosmic(uri: any) {
  const split = uri.split(",");
  const type = split[0].split(";");
  const dataType = type[0].split("/");
  const fileExt = dataType[1];
  const baseUrl = 'https://api.mux.com';
  const proxyUrl = 'https://1v2tdc90i0.execute-api.us-east-1.amazonaws.com/dev/upload-video';
  const name = uuidv4();
  const original_name = `${name}.${fileExt}`;
  const file = new File(uri, original_name)

  const http = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
  });

  function createVideo(url) {
    return http.post(proxyUrl, {
      input: url,
      playback_policy: ['public'],
      proxy: {
        url: `${baseUrl}/video/v1/assets`,
        username: MUX_ACCESS_TOKEN,
        password: MUX_SECRET
      }
    })
  }

  try {
    const { data: response } = await createVideo(file);
    const data = response.data;
    const { object: video } = await bucket.addObject({
      type_slug: 'mux-videos',
      title: original_name,
      content: '',
      options: {
        content_editor: false
      },
      metafields: [
        {
          title: "MUX ID",
          key: 'mux_id',
          type: 'text',
          value: data.id
        },
        {
          title: "MUX Playback ID",
          key: 'mux_playback_id',
          type: 'text',
          value: data.playback_ids[0].id
        },
        {
          title: "MUX Playback URL",
          key: 'mux_playback_url',
          type: 'text',
          value: `https://stream.mux.com/${data.playback_ids[0].id}.m3u8`
        }
      ],
    });

    return video
  } catch(error) {
    throw new Error(error)
  }
}
