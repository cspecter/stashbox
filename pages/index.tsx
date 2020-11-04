// @generated: @expo/next-adapter@2.1.41

import { StyleSheet, Text, View } from 'react-native';

import { getAllBrandsForHome } from '../lib/api'
import HeroPost from '../components/hero-post'
import { Posts } from '../interfaces';

const Index = ({ allPosts }: Posts) => {
    const heroPost = allPosts[0];
    console.log(allPosts)
    return (
        <View style={styles.container}>
            {
                allPosts[0] ? <HeroPost
                    title={heroPost.title}
                    slug={heroPost.slug}
                /> :
                <Text>check for correct .env</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    },
});



export async function getStaticProps({ preview }) {
    const allPosts = (await getAllBrandsForHome(preview)) || []
    return {
        props: { allPosts },
    }
}


export default Index;
