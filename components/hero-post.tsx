
import Link from 'next/link'
import { View, StyleSheet, Text, Image } from 'react-native';


const HeroPost = ({ title, slug }: { title: string, slug: string }) => {
    return (
        <View style={[styles.container, styles.myBorder]}>
            {/* <View style={{flex:3}}></View> */}

            <View style={[styles.inner, styles.myBorder]}>
                
                <Text style={[styles.text]}>
                  
                    <Link as={`/brands/${slug}`} href="/brands/[slug]">
                        <a className="hover:underline">{title}</a>
      
                    </Link>
                </Text>
            </View>

            {/* <View style={{flex:3}}></View> */}

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'green'

    },
    inner: {
        backgroundColor: 'yellow',
        alignContent:'center'
      
    },
    myBorder: {
        borderColor: 'black',
        borderWidth: 2,
    },
    text: {
        flex: 1,
        align:'center',
        fontSize: 36,
        backgroundColor: 'yellow',

    },
});


export default HeroPost