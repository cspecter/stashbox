import Link from 'next/link'
import { StyleSheet, View, Text } from 'react-native';



export default function Head() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>StashBox</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
       fontSize: 24
    },
    container: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: 'red'
    }

});


