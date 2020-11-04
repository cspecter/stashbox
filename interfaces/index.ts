



export interface Post {
    slug: string;
    title: string;
    content?: string;
    metadata?: any;
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

//   interface VideoObjInt  {
//     cancelled:boolean;
//     type?: 'image' | 'video';
//     height?:number;
//     width?:number;
//     uri?:string;
//     exif?: object;
//     base64?:string;
//   }