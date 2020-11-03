import { GetStaticProps, GetStaticPaths, GetStaticPropsContext , GetStaticPropsResult} from 'next'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { StyleSheet, Text, View } from 'react-native';

import { getAllBrandsWithSlug, getBrandAndMoreBrands } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import Header from '../../components/head'
import MoreStories from '../../components/more-stories'
import {  Post, Posts, Preview } from '../../interfaces';



type BrandType = Post & Posts;


const Brand = ({ post, morePosts }: {post:Post, morePosts: Posts}) => {

    return (
        <View>
            <Header />
            <Text style={styles.headline}>{post.title}</Text>
            { morePosts && morePosts.length > 0 && <MoreStories allPosts={morePosts} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "yellow",
        border: "1 solid black"
    },
    headline: {
        fontSize: 32,
    },
    text: {
        fontSize: 16,
    },
});


export default Brand;



export  const  getStaticProps = async  ( { params, preview= null }: { params:Post, preview:Preview  }) => {

    const data = await getBrandAndMoreBrands(params.slug, preview)
    const content:string = await markdownToHtml(data.post?.metadata?.content || '')
  
    return {
      props: {
        preview,
        post: {
          ...data.post,
          content,
        },
        morePosts: data.morePosts || [],
      },
    }
  }
  
  export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = (await getAllBrandsWithSlug()) || []
    return {
      paths: slugs.map((post) => `/brands/${post.slug}`),
      fallback: true,
    }
  } 