
import { StyleSheet, Text, View } from 'react-native';
import Link from 'next/link'

const PostPreview = ({ title, slug }: { title:string, slug:string }) => {
  return (
    <View>

      <Text style={styles.text}>
        <Link as={`/brands/${slug}`} href="/brands/[slug]">
          <a>{title}</a>
        </Link>
      </Text>


     
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
       fontSize: 20,
       marginBottom: 12
    },
    // container: {
    //     flex: 1,
    //     borderColor: 'black',
    //     borderWidth: 2,
    //     backgroundColor: 'red'
    // }

});

export default PostPreview;
