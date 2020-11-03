import {bucket} from './api'

export async function getProducts() {
    const params = {
      type: 'products'
    }

    const data = await bucket.getObjects(params)
    return data.objects
  }