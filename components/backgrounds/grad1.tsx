import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    grad: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        width: "100%"
    },
    container: {
        width,
        height
      },
});

const Grad1 = (props) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                // Background Linear Gradient
                colors={['#D6F1F8', 'rgba(249, 223, 255, 0)', 'rgba(249, 225, 255, 0)', '#D6F1F8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.34, 0.61, 1]}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: "100%",
                    width: "100%"
                }}
            >
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(255, 255, 255, 0)', '#E9FDF6', '#FFE4E1', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.34, 0.61, 1]}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: "100%"
                    }}
                >
                    {props.children}
                </LinearGradient>
            </LinearGradient>
        </View>
    )
}

export default Grad1