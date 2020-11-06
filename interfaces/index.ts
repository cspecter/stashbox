



export interface Post {
    slug: string;
    title: string;
    content?: string;
    metadata?: MetadataObj;
}




export interface Posts extends Array<Post> {
    allPosts?: Post[]
}


export interface Preview {
    preview: true | null;
}

export type FeaturedPostNPosts = Post & Posts;

export interface MediaInt  {
    cancelled:boolean;
    type?: 'image' | 'video';
    height?:number;
    width?:number;
    uri?:string;
    exif?: object;
    base64?:string;
  }

  export interface Metadata {
    key: string,
    value: any
  }
  
  export interface MetadataObj {
      [key: string]: Metadata
  }

  export interface  BucketI  {
    _id:string;
    title:string;
    slug:string;
    object_types: MetadataObj; 
    getObject: (param:MetadataObj) => MetadataObj;
    getObjects: (param:MetadataObj) => [MetadataObj];
}

export interface SignUpI {
    username: string;
    email: string;
    password: string;
}

//   export interface UserInt {
//     slug: string;
//     title: string;
//     username: string;
//     zip_code: string;
//     email: string;
//     birthday: string;
//     is_over_21: boolean;
// }