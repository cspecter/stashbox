
import { StyleSheet, Text, View } from 'react-native';
import PostPreview from './post-preview';
import { Post, Posts } from '../interfaces';





const   MoreStories= ({ allPosts } : {allPosts: Posts}) => {
   
  return (
    <View style={styles.marg}>
      <Text style={styles.headline}>
        More Brands
      </Text>
      <View>
        {allPosts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            slug={post.slug}
           
          />
        ))}
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    marg: {
        margin:50
    },
    headline: {
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 28
    },
    text: {
        fontSize: 16,
        margin: 8
    },
});


export default  MoreStories